import { some } from 'fp-ts/lib/Option';
import { lookup, StrMap } from 'fp-ts/lib/StrMap';
import * as React from 'react';
import {
    forwardRef,
    ForwardRefExoticComponent,
    RefAttributes,
    useImperativeHandle
} from 'react';

import AstNode from 'game-engine/nodes/AstNode';
import KeyUpAble from 'game-engine/services/KeyUpAble';
import GameService from '../../services/game/GameService';
import GameProps from '../../store/GameProps';
import Game from './Game';

interface Args {
    gameService: GameService;
    showGameMenu: () => void;
}

interface Props {
    gameProps: GameProps;
    armlessWankerMenu?: JSX.Element;
}

export type GameType = ForwardRefExoticComponent<
    Props & RefAttributes<KeyUpAble>
>;

const getGame = ({ gameService, showGameMenu }: Args): GameType => {
    const execThenExecNext = some((next: AstNode) => (e: React.MouseEvent) => {
        e.stopPropagation();
        gameService.execThenExecNext(next)();
    });
    return forwardRef(({ gameProps, armlessWankerMenu }, ref) => {
        useImperativeHandle(ref, () => ({ onKeyUp }));

        return (
            <Game
                {...{
                    gameProps,
                    execThenExecNext,
                    armlessWankerMenu,
                    onClick,
                    onWheel
                }}
            />
        );

        function onKeyUp(e: React.KeyboardEvent) {
            const keyEvents = new StrMap<(e: React.KeyboardEvent) => void>({
                ArrowUp: () => {},
                ArrowDown: () => {},
                ArrowLeft: () => {},
                ArrowRight: () => {},
                Escape: showGameMenu,
                ' ': gameService.execNextIfNotMenu,
                Enter: gameService.execNextIfNotMenu,
                Control: () => {},
                Tab: () => {},
                PageUp: gameService.undo,
                PageDown: gameService.redo,
                h: () => {},
                v: () => {},
                s: gameService.quickSave,
                l: gameService.quickLoad
            });
            lookup(e.key, keyEvents).map(action => {
                e.preventDefault();
                e.stopPropagation();
                action(e);
            });
        }

        function onClick(e: React.MouseEvent) {
            if (e.button === 0) gameService.execNextIfNotMenu();
            else if (e.button === 1) showGameMenu();
        }

        function onWheel(e: React.WheelEvent) {
            if (e.deltaY < 0) gameService.undo();
            else if (e.deltaY > 0) gameService.redo();
        }
    });
};
export default getGame;
