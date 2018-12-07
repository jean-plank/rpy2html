import * as React from 'react';
import * as _ from 'lodash';

import '../styles/Game.css';

// classes
import Image from '../classes/Image';
import Char from '../classes/Char';
import Choice from '../classes/Choice';
import Video from '../classes/Video';
import IGameController from '../classes/IGameController';

// components
import LayerScene from './LayerScene';
import LayerChars from './LayerChars';
import Textbox from './Textbox';
import Choices from './Choices';
import Cutscene from './Cutscene';


interface IProps {
    controller: IGameController;
    sceneImg: Image | null;
    charImgs: Image[];
    textboxHide: boolean;
    textboxChar: Char | null;
    textboxText: string;
    choices: Choice[];
    video: Video | null;
    armlessWankerMenu?: JSX.Element;
    videoPaused?: boolean;
}

export default class Game extends React.Component<IProps> {

    render() {
        if (this.props.video === null) {
            return (
                <div className='Game'
                     onClick={this.onClick}
                     onWheel={this.onWheel}>
                    <LayerScene img={this.props.sceneImg} />
                    <LayerChars imgs={this.props.charImgs} />
                    <Textbox hide={this.props.textboxHide}
                             char={this.props.textboxChar}
                             text={this.props.textboxText} />
                    <Choices choices={this.props.choices} />
                    {this.props.armlessWankerMenu}
                </div>
            );
        } else {
            return (
                <div className='Game'
                     onClick={this.onClick}
                     onWheel={this.onWheel}>
                    <Cutscene video={this.props.video}
                              paused={this.props.videoPaused} />
                </div>
            );
        }
    }

    private onClick = (e: React.MouseEvent) => {
        if (e.button === 0) this.props.controller.execNextIfNotMenu();
        else if (e.button === 1) this.props.controller.showGameMenu();
    }

    private onWheel = (e: React.WheelEvent) => {
        if (e.deltaY < 0) this.props.controller.history.previousBlock();
        else if (e.deltaY > 0) this.props.controller.history.nextBlock();
    }
}
