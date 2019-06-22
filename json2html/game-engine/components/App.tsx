/** @jsx jsx */
import { css, Global, jsx } from '@emotion/core';
import { Do } from 'fp-ts-contrib/lib/Do';
import { isEmpty, last } from 'fp-ts/lib/Array';
import { fromNullable, none, Option, option, some } from 'fp-ts/lib/Option';
import { lookup, toArray } from 'fp-ts/lib/StrMap';
import {
    createRef,
    FunctionComponent,
    RefObject,
    useEffect,
    useReducer,
    useRef,
    useState
} from 'react';

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
} from '../context';
import gameHistoryReducer, {
    emptyGameHistoryState
} from '../gameHistory/gameHistoryReducer';
import Font from '../models/Font';
import AstNode from '../nodes/AstNode';
import SoundService from '../SoundService';
import QuickSave from '../storage/QuickSave';
import Saves from '../storage/Saves';
import savesReducer from '../storage/savesReducer';
import { historyFromState, loadAction, saveAction } from '../utils/saveLoad';
import { mediaQuery } from '../utils/styles';
import Confirm from './Confirm';
import Game from './game/Game';
import GameMenu from './menus/gameMenu/GameMenu';
import GameMenuBtn from './menus/gameMenu/GameMenuBtn';
import MainMenu from './menus/mainMenu/MainMenu';
import Notifications, { Notifiable } from './Notifications';

export interface KeyUpAble {
    onKeyUp: (e: React.KeyboardEvent) => void;
}

export type GameAble = KeyUpAble & {
    execThenExecNext: (node: AstNode) => void;
};

type View =
    | 'NONE'
    | 'MAIN_MENU'
    | 'GAME'
    | { type: 'GAME_MENU'; selectedBtn: GameMenuBtn };

const App: FunctionComponent = () => {
    const confirmAudioShown = useRef(false);
    const soundService = new SoundService(confirmAudio);

    const viewKeyUpAble: RefObject<KeyUpAble> = createRef();
    const gameAble: RefObject<GameAble> = createRef();
    const notifiable: RefObject<Notifiable> = createRef();
    const confirmKeyUpAble: RefObject<KeyUpAble> = createRef();

    const [view, setView] = useState<View>('NONE');
    const [confirm, setConfirm] = useState<Option<JSX.Element>>(none);
    const [saves, dispatchSavesAction] = useReducer(
        savesReducer,
        Saves.fromStorage()
    );
    const [gameState, dispatchGameHistoryAction] = useReducer(
        gameHistoryReducer,
        emptyGameHistoryState
    );

    const data = { nodes, chars, sounds, videos, images };
    nodes.mapWithKey((id, node) => node.init({ id, data, execThenExecNext }));
    firstNode.loadBlock();

    useEffect(() => {
        initDom();
        showMainMenu();
    }, []);

    return (
        <div tabIndex={0} onKeyUp={onKeyUp} css={styles.container}>
            <Global styles={globalStyles} />
            <div css={styles.view}>{getView(view)}</div>
            {<Notifications ref={notifiable} />}
            {confirm.toNullable()}
        </div>
    );

    function getView(view: View): JSX.Element | null {
        if (view === 'NONE') return null;
        if (view === 'MAIN_MENU') {
            return (
                <MainMenu
                    ref={viewKeyUpAble}
                    startGame={startGame}
                    saves={saves.slots}
                    emptySaves={emptySaves}
                    loadSave={loadSave}
                />
            );
        }
        if (view === 'GAME') {
            return gameState.present
                .map(([gameProps]) => (
                    // tslint:disable-next-line: jsx-key
                    <Game
                        ref={gameAble}
                        gameProps={gameProps}
                        armlessWankerMenuProps={{
                            showGameMenu,
                            undo,
                            disableUndo: isEmpty(gameState.past),
                            quickSave,
                            quickLoad,
                            disableQuickLoad: saves.quickSave.isNone(),
                            soundService,
                            currentNode: currentNode(),
                            showMainMenu,
                            addBlock,
                            redo,
                            onVideoEnded
                        }}
                    />
                ))
                .toNullable();
        }
        if (view.type === 'GAME_MENU') {
            return (
                <GameMenu
                    ref={viewKeyUpAble}
                    history={historyFromState(gameState)}
                    saves={saves.slots}
                    loadSave={loadSave}
                    hideGameMenu={hideGameMenu}
                    showMainMenu={showMainMenu}
                    save={save}
                    confirmYesNo={confirmYesNo}
                    selectedBtn={view.selectedBtn}
                />
            );
        }
        return null;
    }

    function onKeyUp(e: React.KeyboardEvent) {
        confirm
            .map<void>(_ =>
                fromNullable(confirmKeyUpAble.current).map(_ => _.onKeyUp(e))
            )
            .orElse(() => fromNullable(gameAble.current).map(_ => _.onKeyUp(e)))
            .orElse(() =>
                fromNullable(viewKeyUpAble.current).map(_ => _.onKeyUp(e))
            );
    }

    function showMainMenu() {
        soundService.playMainMenuMusic();
        setView('MAIN_MENU');
    }

    function startGame() {
        dispatchGameHistoryAction({ type: 'EMPTY' });
        dispatchGameHistoryAction({
            type: 'ADD_BLOCK',
            block: [firstNode, ...firstNode.followingBlock()]
        });
        showGame();
    }

    function showGame() {
        setView('GAME');
    }

    function onVideoEnded(execNextIfNotMenu: () => void) {
        isEmpty(gameState.future) ? execNextIfNotMenu() : redo();
    }

    function showGameMenu(selectedBtn: GameMenuBtn = 'NONE') {
        soundService.pauseChannels();
        setView({ type: 'GAME_MENU', selectedBtn });
    }

    function hideGameMenu() {
        soundService.resumeChannels();
        showGame();
    }

    function execThenExecNext(node: AstNode): () => void {
        return () =>
            fromNullable(gameAble.current).map(_ => _.execThenExecNext(node));
    }

    function addBlock(block: AstNode[]) {
        dispatchGameHistoryAction({ type: 'ADD_BLOCK', block });
    }

    function currentNode(): Option<AstNode> {
        return Do(option)
            .bind('present', gameState.present)
            .bindL('currentNode', ({ present: [, block] }) => last(block))
            .return(({ currentNode }) => currentNode);
    }

    function undo() {
        dispatchGameHistoryAction({ type: 'UNDO' });
    }

    function redo() {
        dispatchGameHistoryAction({ type: 'REDO' });
    }

    function emptySaves() {
        dispatchSavesAction('EMPTY');
    }

    function loadSave(save: QuickSave) {
        loadAction(firstNode, save)
            .map(_ => {
                dispatchGameHistoryAction(_);
                showGame();
            })
            .getOrElseL(() => notify("Couldn't restore save"));
    }

    function save(slot: number) {
        dispatchSavesAction(saveAction(gameState, slot));
    }

    function quickLoad() {
        saves.quickSave.map(loadSave);
    }

    function quickSave() {
        dispatchSavesAction(saveAction(gameState));
        notify(transl.menu.saved);
    }

    function confirmAudio(okAction: () => void) {
        if (!confirmAudioShown.current) {
            confirmAudioShown.current = true;
            setConfirm(
                some(
                    <Confirm
                        ref={confirmKeyUpAble}
                        hideConfirm={hideConfirm}
                        message={transl.confirm.audio}
                        buttons={[
                            { text: transl.confirm.audioBtn, onClick: okAction }
                        ]}
                        escapeAction={okAction}
                    />
                )
            );
        }
    }

    function confirmYesNo(
        message: string,
        actionYes: () => void,
        actionNo?: () => void
    ) {
        setConfirm(
            some(
                <Confirm
                    ref={confirmKeyUpAble}
                    hideConfirm={hideConfirm}
                    message={message}
                    buttons={[
                        { text: transl.confirm.yes, onClick: actionYes },
                        { text: transl.confirm.no, onClick: actionNo }
                    ]}
                    escapeAction={actionNo}
                />
            )
        );
    }

    function hideConfirm() {
        setConfirm(none);
    }

    function notify(message: string) {
        fromNullable(notifiable.current).map(_ => _.notify(message));
    }
};
export default App;

const initDom = () => {
    document.title = gameName;
    lookup('game_icon', images).map(
        icon =>
            (fromNullable(document.querySelector(
                'link[rel*="icon"]'
            ) as HTMLLinkElement).getOrElseL(() => {
                const link = document.createElement('link');
                link.rel = 'shortcut icon';
                document.head.appendChild(link);
                return link;
            }).href = icon.file)
    );
};

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
);

function getFonts() {
    return toArray(fonts).map(([name, font]) =>
        name === 'dejavusans_bold_ttf'
            ? Font.face('dejavusans_ttf', font)
            : Font.face(name, font)
    );
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
};
