import * as React from 'react';
import { FunctionComponent } from 'react';

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
    armlessWankerMenu?: JSX.Element;
    onClick?: (e: React.MouseEvent) => void;
    onWheel?: (e: React.WheelEvent) => void;
    style?: string;
}

const Game: FunctionComponent<Props> = ({
    gameProps,
    armlessWankerMenu,
    onClick,
    onWheel,
    style
}) => {
    const classes =
        style === undefined ? styles.game : `${styles.game} ${style}`;

    return gameProps.video
        .map(_ => cutsceneLayout(_))
        .getOrElseL(defaultLayout);

    function cutsceneLayout(video: Video): JSX.Element {
        return (
            <div className={classes} {...{ onClick, onWheel }}>
                <Cutscene video={video} />
            </div>
        );
    }

    function defaultLayout(): JSX.Element {
        return (
            <div className={classes} {...{ onClick, onWheel }}>
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
