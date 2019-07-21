/** @jsx jsx */
import { css, Global, jsx } from '@emotion/core'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import * as R from 'fp-ts/lib/Record'
import { FunctionComponent, useEffect, useMemo, useState } from 'react'

import * as context from '../context'
import Font from '../Font'
import { GameState } from '../history/gameStateReducer'
import useConfirm from '../hooks/useConfirm'
import useHistory from '../hooks/useHistory'
import useKeyUp from '../hooks/useKeyUp'
import useKeyUpAbles from '../hooks/useKeyUpAbles'
import useNotify from '../hooks/useNotify'
import useSaves from '../hooks/useSaves'
import { AppData } from '../nodes/AstNode'
import SoundService from '../sound/SoundService'
import {
    enterFullscreen,
    exitFullscreen,
    isFullscreen
} from '../utils/fullscreen'
import { mediaQuery } from '../utils/styles'
import Game from './game/Game'
import GameMenu from './menus/gameMenu/GameMenu'
import MainMenu from './menus/mainMenu/MainMenu'
import MenuBtn from './menus/MenuBtn'

export interface KeyUpAble {
    onKeyUp: (e: KeyboardEvent) => void
}

type View =
    | 'MAIN_MENU'
    | 'GAME'
    | { type: 'GAME_MENU'; selectedBtn: O.Option<MenuBtn> }

const App: FunctionComponent = () => {
    useEffect(() => initAll(context), [])

    const { topKeyUpAble, viewKeyUpAble, confirmKeyUpAble } = useKeyUpAbles()

    const { confirm, confirmAudio, confirmYesNo } = useConfirm(
        confirmKeyUpAble
    )

    const soundService = useMemo(() => new SoundService(confirmAudio), [])

    const [view, setView] = useState<O.Option<View>>(O.none)

    const { notifications, notify } = useNotify()

    const historyHook = useHistory(
        () => savesHook.saves.quickSave,
        soundService,
        notify,
        showGame,
        showMainMenu
    )

    const savesHook = useSaves(historyHook.historyFromState, notify)

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
                {notifications}
                {confirm}
            </div>
        </div>
    )

    function getView(view: View): O.Option<JSX.Element> {
        if (view === 'MAIN_MENU') return O.some(mainMenuL())
        if (view === 'GAME') {
            return pipe(
                historyHook.present,
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
                savesHook={savesHook}
                historyHook={historyHook}
                confirmYesNo={confirmYesNo}
            />
        )
    }

    function getGame([gameProps]: GameState): JSX.Element {
        return (
            <Game
                ref={viewKeyUpAble}
                gameProps={gameProps}
                armlessWankerMenuProps={{
                    showGameMenu,
                    savesHook,
                    historyHook,
                    soundService,
                    showMainMenu,
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
                hideGameMenu={hideGameMenu}
                showMainMenu={showMainMenu}
                savesHook={savesHook}
                historyHook={historyHook}
                confirmYesNo={confirmYesNo}
                selectedBtn={selectedBtn}
            />
        )
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
        historyHook.empty()
        historyHook.addBlock([
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
        historyHook.noFuture() ? execNextIfNotMenu() : historyHook.redo()
    }

    function showGameMenu(selectedBtn: O.Option<MenuBtn> = O.none) {
        soundService.pauseChannels()
        setView(O.some({ type: 'GAME_MENU', selectedBtn }))
    }

    function hideGameMenu() {
        soundService.resumeChannels()
        showGame()
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
