import * as React from 'react';
import * as _ from 'lodash';

import '../styles/Game.css';

// classes
import IGameController from '../classes/IGameController';
import { IGameProps } from '../classes/GameProps';

// components
import LayerScene from './LayerScene';
import LayerChars from './LayerChars';
import Textbox from './Textbox';
import Choices from './Choices';


interface IProps {
    controller: IGameController;
    game: IGameProps;
    armlessWankerMenu?: JSX.Element;
}

export default class Game extends React.Component<IProps> {
    render() {
        return (
            <div className='Game'
                 onClick={this.onClick()}
                 onWheel={this.onWheel()}>
                <LayerScene img={this.props.game.sceneImg} />
                <LayerChars imgs={this.props.game.charImgs} />
                <Textbox hide={this.props.game.textboxHide}
                         char={this.props.game.textboxChar}
                         text={this.props.game.textboxText} />
                <Choices choices={this.props.game.choices} />
                {this.props.armlessWankerMenu}
            </div>
        );
    }

    private onClick = () => (e: React.MouseEvent) => {
        if (e.button === 0) this.props.controller.execNextIfNotMenu();
    }

    private onWheel = () => (e: React.WheelEvent) => {
        if (e.deltaY < 0) this.props.controller.history.previousBlock();
        else if (e.deltaY > 0) this.props.controller.history.nextBlock();
    }
}
