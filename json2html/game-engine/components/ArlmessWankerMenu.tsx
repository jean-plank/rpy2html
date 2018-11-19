import * as React from 'react';
import * as _ from 'lodash';

import '../styles/ArmlessWankerMenu.css';

import App from './App';
import MenuButton from './MenuButton';
import { GameMenuBtn } from './GameMenu';


interface IProps {
    app: App;
}

export default class ArmlessWankerMenu extends React.Component<IProps> {
    render() {
        const isDisabled =
            this.props.app.gameController.history.noPreviousBlock();

        return (
            <div className='ArmlessWankerMenu'>
                <MenuButton text={this.props.app.lang.menu.back}
                            action={this.goBack()}
                            disabled={isDisabled} />

                <MenuButton text={this.props.app.lang.menu.history}
                            action={this.showGameMenu(GameMenuBtn.History)} />

                <MenuButton text={this.props.app.lang.menu.save}
                            action={this.showGameMenu(GameMenuBtn.Save)} />

                <MenuButton text={this.props.app.lang.menu.pause}
                            action={this.showGameMenu()} />
            </div>
        );
    }

    private goBack = () => (e: React.MouseEvent) => {
        e.stopPropagation();
        this.props.app.gameController.history.previousBlock();
    }

    private showGameMenu = (btn?: GameMenuBtn) => (e: React.MouseEvent) => {
        e.stopPropagation();
        this.props.app.showGameMenu(btn);
    }
}
