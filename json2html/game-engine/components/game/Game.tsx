import * as React from 'react';
import { FunctionComponent, useEffect } from 'react';

import * as styles from './__style/Game.css';

import Video from '../../models/medias/Video';
import GameProps from '../../store/GameProps';
import Choices from './Choices';
import Cutscene from './Cutscene';
import LayerImages from './LayerImages';
import LayerScene from './LayerScene';
import Textbox from './Textbox';

interface Props {
    gameProps: GameProps;
    mountCallback?: () => void;
    armlessWankerMenu?: JSX.Element;
    onKeyUp?: (e: React.KeyboardEvent) => void;
    onClick?: (e: React.MouseEvent) => void;
    onWheel?: (e: React.WheelEvent) => void;
    style?: string;
}

const Game: FunctionComponent<Props> = ({
    gameProps,
    mountCallback = () => {},
    armlessWankerMenu,
    onKeyUp,
    onClick,
    onWheel,
    style
}) => {
    useEffect(mountCallback, []);

    const classes = [styles.game]
        .concat(style === undefined ? [] : style)
        .join(' ');

    return gameProps.video
        .map(_ => cutsceneLayout(_))
        .getOrElseL(defaultLayout);

    function cutsceneLayout(video: Video): JSX.Element {
        return (
            <div
                className={classes}
                tabIndex={0}
                {...{ onKeyUp, onClick, onWheel }}
            >
                <Cutscene video={video} />
            </div>
        );
    }

    function defaultLayout(): JSX.Element {
        return (
            <div
                className={classes}
                tabIndex={1}
                {...{ onKeyUp, onClick, onWheel }}
            >
                <LayerScene image={gameProps.sceneImg} />
                <LayerImages images={gameProps.charImgs} />
                <Textbox
                    hide={gameProps.textboxHide}
                    char={gameProps.textboxChar}
                    text={gameProps.textboxText}
                />
                <Choices choices={gameProps.choices} />
                {armlessWankerMenu}
            </div>
        );
    }
};
export default Game;
