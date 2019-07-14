/** @jsx jsx */
import { css, Global, jsx } from '@emotion/core'
import { Do } from 'fp-ts-contrib/lib/Do'
import { findFirstMap, isEmpty, last } from 'fp-ts/lib/Array'
import { fromNullable, none, Option, option, some } from 'fp-ts/lib/Option'
import { lookup, toArray } from 'fp-ts/lib/StrMap'
import {
    createRef,
    FunctionComponent,
    RefObject,
    useEffect,
    useMemo,
    useReducer,
    useRef,
    useState
} from 'react'

import GameProps from 'game-engine/gameHistory/GameProps'
import {
    chars,
    firstNode,
    fonts,
    gameName,
    images,
    nodes,
    sounds,
    style,
    transl,
    videos
} from '../context'
import gameHistoryReducer, {
    emptyGameHistoryState
} from '../gameHistory/gameHistoryReducer'
import Font from '../models/Font'
import AstNode from '../nodes/AstNode'
import Menu from '../nodes/Menu'
import SoundService from '../SoundService'
import QuickSave from '../storage/QuickSave'
import Saves from '../storage/Saves'
import savesReducer from '../storage/savesReducer'
import { historyFromState, loadAction, saveAction } from '../utils/saveLoad'
import { mediaQuery } from '../utils/styles'
import Confirm, { ConfirmProps } from './Confirm'
import Game from './game/Game'
import GameMenu from './menus/gameMenu/GameMenu'
import MainMenu from './menus/mainMenu/MainMenu'
import { MenuBtn } from './menus/Menu'
import Notifications, { Notifiable } from './Notifications'

export interface KeyUpAble {
    onKeyUp: (e: React.KeyboardEvent) => void
}

export type GameAble = KeyUpAble & {
    execThenExecNext: (node: AstNode) => void;
}

type View =
    | 'MAIN_MENU'
    | 'GAME'
    | { type: 'GAME_MENU'; selectedBtn: Option<MenuBtn> }

const App: FunctionComponent = () => {
    const confirmAudioShown = useRef(false)
    const soundService = useMemo(() => new SoundService(confirmAudio), [])

    const viewKeyUpAble: RefObject<KeyUpAble> = createRef()
    const gameAble: RefObject<GameAble> = createRef()
    const notifiable: RefObject<Notifiable> = createRef()
    const confirmKeyUpAble: RefObject<KeyUpAble> = createRef()

    const [view, setView] = useState<Option<View>>(none)
    const [confirm, setConfirm] = useState<Option<ConfirmProps>>(none)
    const [saves, dispatchSavesAction] = useReducer(
        savesReducer,
        Saves.fromStorage()
    )
    const [gameState, dispatchGameHistoryAction] = useReducer(
        gameHistoryReducer,
        emptyGameHistoryState
    )

    const data = { nodes, chars, sounds, videos, images }

    useEffect(() => {
        nodes.mapWithKey((id, node) =>
            node.init({ id, data, execThenExecNext })
        )
        firstNode.loadBlock()
        initDom()
        showMainMenu()
    }, [])

    return (
        <div tabIndex={0} onKeyUp={onKeyUp} css={styles.container}>
            <Global styles={globalStyles} />
            <div css={styles.view}>
                {view.chain(getView).toNullable()}
                {<Notifications ref={notifiable} />}
                {confirm.map(getConfirm).toNullable()}
            </div>
        </div>
    )

    function getView(view: View): Option<JSX.Element> {
        if (view === 'MAIN_MENU') return some(mainMenuL())
        if (view === 'GAME') return gameState.present.map(getGame)
        return some(getGameMenu(view.selectedBtn))
    }

    function mainMenuL(): JSX.Element {
        return (
            <MainMenu
                ref={viewKeyUpAble}
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
                ref={gameAble}
                gameProps={gameProps}
                armlessWankerMenuProps={{
                    showGameMenu,
                    undo,
                    disableUndo: isEmpty(gameState.past),
                    skip,
                    quickSave,
                    quickLoad,
                    disableQuickLoad: saves.quickSave.isNone(),
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

    function getGameMenu(selectedBtn: Option<MenuBtn>): JSX.Element {
        return (
            <GameMenu
                ref={viewKeyUpAble}
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

    function onKeyUp(e: React.KeyboardEvent) {
        findFirstMap((_: RefObject<KeyUpAble>) => fromNullable(_.current))([
            confirmKeyUpAble,
            gameAble,
            viewKeyUpAble
        ]).map(_ => _.onKeyUp(e))
    }

    function showMainMenu() {
        soundService.playMainMenuMusic()
        setView(some('MAIN_MENU'))
    }

    function startGame() {
        dispatchGameHistoryAction({ type: 'EMPTY' })
        addBlock([firstNode, ...firstNode.followingBlock().getOrElse([])])
        showGame()
    }

    function showGame() {
        setView(some('GAME'))
    }

    function onVideoEnded(execNextIfNotMenu: () => void) {
        isEmpty(gameState.future) ? execNextIfNotMenu() : redo()
    }

    function showGameMenu(selectedBtn: Option<MenuBtn> = none) {
        soundService.pauseChannels()
        setView(some({ type: 'GAME_MENU', selectedBtn }))
    }

    function hideGameMenu() {
        soundService.resumeChannels()
        showGame()
    }

    function execThenExecNext(node: AstNode): () => void {
        return () =>
            fromNullable(gameAble.current).map(_ => _.execThenExecNext(node))
    }

    function skip() {
        currentNodeL().map(currentNode => {
            if (!(currentNode instanceof Menu)) {
                skipFromNode(currentNode)
                    .map<void>(_ => _.map(addBlock))
                    .getOrElseL(showMainMenu)
            }
        })

        function skipFromNode(node: AstNode): Option<AstNode[][]> {
            return node
                .followingBlock()
                .chain(block => last(block).map(skipRec([block])))
        }

        function skipRec(acc: AstNode[][]): (node: AstNode) => AstNode[][] {
            return node => {
                if (node instanceof Menu) return acc
                return node.followingBlock().fold<AstNode[][]>(acc, block => {
                    const newAcc = [...acc, block]
                    return last(block)
                        .map(skipRec(newAcc))
                        .getOrElse(newAcc)
                })
            }
        }
    }

    function addBlock(block: AstNode[]) {
        dispatchGameHistoryAction({ type: 'ADD_BLOCK', block })
    }

    function currentNodeL(): Option<AstNode> {
        return Do(option)
            .bind('present', gameState.present)
            .bindL('currentNode', ({ present: [, block] }) => last(block))
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
        loadAction(firstNode, save)
            .map(_ => {
                soundService.stopChannels()
                dispatchGameHistoryAction(_)
                showGame()
            })
            .getOrElseL(() => notify("Couldn't restore save"))
    }

    function save(slot: number) {
        dispatchSavesAction(saveAction(gameState, slot))
    }

    function quickLoad() {
        saves.quickSave.map(loadSave)
    }

    function quickSave() {
        dispatchSavesAction(saveAction(gameState))
        notify(transl.menu.saved)
    }

    function confirmAudio(okAction: () => void) {
        if (!confirmAudioShown.current) {
            confirmAudioShown.current = true
            setConfirm(
                some({
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
            some({
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
        setConfirm(none)
    }

    function notify(message: string) {
        fromNullable(notifiable.current).map(_ => _.notify(message))
    }
}
export default App

const initDom = () => {
    document.title = gameName
    lookup('game_icon', images).map(
        icon =>
            (fromNullable(document.querySelector(
                'link[rel*="icon"]'
            ) as HTMLLinkElement).getOrElseL(() => {
                const link = document.createElement('link')
                link.rel = 'shortcut icon'
                document.head.appendChild(link)
                return link
            }).href = icon.file)
    )
}

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
            whiteSpace: 'nowrap'
        }
    },
    ...getFonts()
)

function getFonts() {
    return toArray(fonts).map(([name, font]) =>
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
        [mediaQuery(style)]: {
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
        width: `${(100 * style.game_width) / style.game_height}vh`,
        [mediaQuery(style)]: {
            width: '100vw',
            height: `${(100 * style.game_height) / style.game_width}vw`
        }
    })
}
