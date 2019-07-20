/** @jsx jsx */
import { css, Global, jsx } from '@emotion/core'
import { Do } from 'fp-ts-contrib/lib/Do'
import * as A from 'fp-ts/lib/Array'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import * as R from 'fp-ts/lib/Record'
import {
    createRef,
    FunctionComponent,
    useEffect,
    useMemo,
    useReducer,
    useRef,
    useState
} from 'react'

import * as context from '../context'
import { transl } from '../context'
import Font from '../Font'
import gameHistoryReducer, {
    emptyGameHistoryState
} from '../history/gameHistoryReducer'
import GameProps from '../history/GameProps'
import useAppKeyUpAbles from '../hooks/useAppKeyUpAbles'
import useKeyUp from '../hooks/useKeyUp'
import AstNode, { AppData } from '../nodes/AstNode'
import Menu from '../nodes/Menu'
import QuickSave from '../saves/QuickSave'
import Saves from '../saves/Saves'
import savesReducer from '../saves/savesReducer'
import SoundService from '../sound/SoundService'
import {
    enterFullscreen,
    exitFullscreen,
    isFullscreen
} from '../utils/fullscreen'
import { historyFromState, loadAction, saveAction } from '../utils/saveLoad'
import { mediaQuery } from '../utils/styles'
import Confirm, { ConfirmProps } from './Confirm'
import Game from './game/Game'
import GameMenu from './menus/gameMenu/GameMenu'
import MainMenu from './menus/mainMenu/MainMenu'
import MenuBtn from './menus/MenuBtn'
import Notifications, { Notifiable } from './Notifications'

export interface KeyUpAble {
    onKeyUp: (e: KeyboardEvent) => void
}

type View =
    | 'MAIN_MENU'
    | 'GAME'
    | { type: 'GAME_MENU'; selectedBtn: O.Option<MenuBtn> }

const App: FunctionComponent = () => {
    const confirmAudioShown = useRef(false)
    const soundService = useMemo(() => new SoundService(confirmAudio), [])

    const notifiable = createRef<Notifiable>()

    const {
        topKeyUpAble,
        viewKeyUpAble,
        confirmKeyUpAble
    } = useAppKeyUpAbles()

    const [view, setView] = useState<O.Option<View>>(O.none)
    const [confirm, setConfirm] = useState<O.Option<ConfirmProps>>(O.none)
    const [saves, dispatchSavesAction] = useReducer(
        savesReducer,
        Saves.fromStorage()
    )
    const [gameState, dispatchGameHistoryAction] = useReducer(
        gameHistoryReducer,
        emptyGameHistoryState
    )

    useEffect(() => initAll(context), [])

    useKeyUp(onKeyUp)

    return (
        <div css={styles.container}>
            <Global styles={globalStyles} />
            <div css={styles.view}>
                {pipe(
                    view,
                    O.chain(getView),
                    O.toNullable
                )}
                {<Notifications ref={notifiable} />}
                {pipe(
                    confirm,
                    O.map(getConfirm),
                    O.toNullable
                )}
            </div>
        </div>
    )

    function getView(view: View): O.Option<JSX.Element> {
        if (view === 'MAIN_MENU') return O.some(mainMenuL())
        if (view === 'GAME') {
            return pipe(
                gameState.present,
                O.map(getGame)
            )
        }
        return O.some(getGameMenu(view.selectedBtn))
    }

    function mainMenuL(): JSX.Element {
        return (
            <MainMenu
                ref={viewKeyUpAble}
                soundService={soundService}
                startGame={startGame}
                saves={saves.slots}
                emptySaves={emptySaves}
                loadSave={loadSave}
                deleteSave={deleteSave}
                confirmYesNo={confirmYesNo}
            />
        )
    }

    function getGame([gameProps]: [GameProps, AstNode[]]): JSX.Element {
        return (
            <Game
                ref={viewKeyUpAble}
                gameProps={gameProps}
                armlessWankerMenuProps={{
                    showGameMenu,
                    undo,
                    disableUndo: A.isEmpty(gameState.past),
                    skip,
                    quickSave,
                    quickLoad,
                    disableQuickLoad: O.isNone(saves.quickSave),
                    soundService,
                    currentNodeL,
                    showMainMenu,
                    addBlock,
                    redo,
                    onVideoEnded
                }}
            />
        )
    }

    function getGameMenu(selectedBtn: O.Option<MenuBtn>): JSX.Element {
        return (
            <GameMenu
                ref={viewKeyUpAble}
                soundService={soundService}
                history={historyFromState(gameState)}
                saves={saves.slots}
                loadSave={loadSave}
                deleteSave={deleteSave}
                hideGameMenu={hideGameMenu}
                showMainMenu={showMainMenu}
                save={save}
                confirmYesNo={confirmYesNo}
                selectedBtn={selectedBtn}
            />
        )
    }

    function getConfirm(iConfirm: ConfirmProps): JSX.Element {
        return <Confirm ref={confirmKeyUpAble} {...iConfirm} />
    }

    function onKeyUp(e: KeyboardEvent) {
        if (e.key === 'f') return toggleFullscreen()

        function toggleFullscreen() {
            if (isFullscreen()) exitFullscreen()
            else enterFullscreen()
        }

        pipe(
            topKeyUpAble(),
            O.map(_ => _.onKeyUp(e))
        )
    }

    function initAll(data: AppData) {
        initDom()
        pipe(
            context.nodes,
            R.mapWithIndex((id, node) => node.init({ id, data }))
        )
        context.firstNode.loadBlock()
        showMainMenu()
    }

    function initDom() {
        document.title = context.gameName
        pipe(
            R.lookup('game_icon', context.images),
            O.map(
                icon =>
                    (pipe(
                        O.fromNullable(document.querySelector(
                            'link[rel*="icon"]'
                        ) as HTMLLinkElement),
                        O.getOrElse(() => {
                            const link = document.createElement('link')
                            link.rel = 'shortcut icon'
                            document.head.appendChild(link)
                            return link
                        })
                    ).href = icon.file)
            )
        )
    }

    function showMainMenu() {
        soundService.playMainMenuMusic()
        setView(O.some('MAIN_MENU'))
    }

    function startGame() {
        dispatchGameHistoryAction({ type: 'EMPTY' })
        addBlock([
            context.firstNode,
            ...pipe(
                context.firstNode.followingBlock(),
                O.getOrElse(() => [])
            )
        ])
        showGame()
    }

    function showGame() {
        setView(O.some('GAME'))
    }

    function onVideoEnded(execNextIfNotMenu: () => void) {
        A.isEmpty(gameState.future) ? execNextIfNotMenu() : redo()
    }

    function showGameMenu(selectedBtn: O.Option<MenuBtn> = O.none) {
        soundService.pauseChannels()
        setView(O.some({ type: 'GAME_MENU', selectedBtn }))
    }

    function hideGameMenu() {
        soundService.resumeChannels()
        showGame()
    }

    function skip() {
        pipe(
            currentNodeL(),
            O.map(currentNode => {
                if (!(currentNode instanceof Menu)) {
                    pipe(
                        skipFromNode(currentNode),
                        O.map<AstNode[][], void>(_ => _.map(addBlock)),
                        O.getOrElse(showMainMenu)
                    )
                }
            })
        )

        function skipFromNode(node: AstNode): O.Option<AstNode[][]> {
            return pipe(
                node.followingBlock(),
                O.chain(block =>
                    pipe(
                        A.last(block),
                        O.map(skipRec([block]))
                    )
                )
            )
        }

        function skipRec(acc: AstNode[][]): (node: AstNode) => AstNode[][] {
            return node => {
                if (node instanceof Menu) return acc
                return pipe(
                    node.followingBlock(),
                    O.fold(
                        () => acc,
                        block => {
                            const newAcc = [...acc, block]
                            return pipe(
                                A.last(block),
                                O.map(skipRec(newAcc)),
                                O.getOrElse(() => newAcc)
                            )
                        }
                    )
                )
            }
        }
    }

    function addBlock(block: AstNode[]) {
        dispatchGameHistoryAction({ type: 'ADD_BLOCK', block })
    }

    function currentNodeL(): O.Option<AstNode> {
        return Do(O.option)
            .bind('present', gameState.present)
            .bindL('currentNode', ({ present: [, block] }) => A.last(block))
            .return(({ currentNode }) => currentNode)
    }

    function undo() {
        dispatchGameHistoryAction({ type: 'UNDO' })
    }

    function redo() {
        dispatchGameHistoryAction({ type: 'REDO' })
    }

    function emptySaves() {
        dispatchSavesAction('EMPTY')
    }

    function deleteSave(slot: number) {
        console.warn(
            `Save slot ${slot} was deleted because it couldn't be restored.`
        )
        dispatchSavesAction({ type: 'DELETE', slot })
    }

    function loadSave(save: QuickSave) {
        pipe(
            loadAction(context.firstNode, save),
            O.map(_ => {
                soundService.stopChannels()
                dispatchGameHistoryAction(_)
                showGame()
            }),
            O.getOrElse(() => notify("Couldn't restore save"))
        )
    }

    function save(slot: number) {
        dispatchSavesAction(saveAction(gameState, slot))
    }

    function quickLoad() {
        pipe(
            saves.quickSave,
            O.map(loadSave)
        )
    }

    function quickSave() {
        dispatchSavesAction(saveAction(gameState))
        notify(context.transl.armless.saved)
    }

    function confirmAudio(okAction: () => void) {
        if (!confirmAudioShown.current) {
            confirmAudioShown.current = true
            setConfirm(
                O.some({
                    hideConfirm,
                    message: transl.confirm.audio,
                    buttons: [
                        { text: transl.confirm.audioBtn, onClick: okAction }
                    ],
                    escapeAction: okAction
                })
            )
        }
    }

    function confirmYesNo(
        message: string,
        actionYes: () => void,
        actionNo?: () => void
    ) {
        setConfirm(
            O.some({
                hideConfirm,
                message,
                buttons: [
                    { text: transl.confirm.yes, onClick: actionYes },
                    { text: transl.confirm.no, onClick: actionNo }
                ],
                escapeAction: actionNo
            })
        )
    }

    function hideConfirm() {
        setConfirm(O.none)
    }

    function notify(message: string) {
        pipe(
            O.fromNullable(notifiable.current),
            O.map(_ => _.notify(message))
        )
    }
}
export default App

const globalStyles = css(
    {
        html: {
            boxSizing: 'border-box'
        },
        '*, ::before, ::after': {
            boxSizing: 'inherit'
        },
        body: {
            margin: 0,
            backgroundColor: 'black',
            color: '#eee',
            overflow: 'hidden',
            fontFamily: ['Arial', 'Helvetica', 'sans-serif']
        },
        a: {
            textDecoration: 'none'
        },
        button: {
            border: 'none',
            color: 'inherit',
            outline: 0,
            background: 'none',
            fontSize: '1em',
            padding: 0,
            textOverflow: 'unset',
            '&:not([disabled])': {
                cursor: 'pointer'
            }
        }
    },
    ...getFonts()
)

function getFonts() {
    return R.toArray(context.fonts).map(([name, font]) =>
        name === 'dejavusans_bold_ttf'
            ? Font.face('dejavusans_ttf', font)
            : Font.face(name, font)
    )
}

const styles = {
    container: css({
        display: 'flex',
        justifyContent: 'center',
        width: '100vw',
        height: '100vh',
        [mediaQuery(context.style)]: {
            flexDirection: 'column'
        },

        '& *, & ::before, & ::after': {
            userSelect: 'none'
        }
    }),

    view: css({
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        width: `${(100 * context.style.game_width) /
            context.style.game_height}vh`,
        [mediaQuery(context.style)]: {
            width: '100vw',
            height: `${(100 * context.style.game_height) /
                context.style.game_width}vw`
        }
    })
}
