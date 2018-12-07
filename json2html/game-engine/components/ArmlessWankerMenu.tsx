import * as React from 'react';
import * as _ from 'lodash';

import '../styles/ArmlessWankerMenu.css';

import App from './App';
import MenuButton from './MenuButton';
import { GameMenuBtn } from './GameMenu';


interface IProps {
    app: App;
}

interface IState {
    disableQuickLoad: boolean;
}

export default class ArmlessWankerMenu extends React.Component<IProps, IState> {
    state: IState = {
        disableQuickLoad: true,
    };

    render() {
        const isDisabled =
            this.props.app.gameController.history.noPreviousBlock();

        return (
            <div className='ArmlessWankerMenu'>
                <MenuButton text={this.props.app.lang.menu.back}
                            action={this.goBack}
                            disabled={isDisabled} />

                <MenuButton text={this.props.app.lang.menu.history}
                            action={this.showGameMenu(GameMenuBtn.History)} />

                <MenuButton text={this.props.app.lang.menu.save}
                            action={this.showGameMenu(GameMenuBtn.Save)} />

                <MenuButton text={this.props.app.lang.menu.qSave}
                            action={this.quickSave} />

                <MenuButton text={this.props.app.lang.menu.qLoad}
                            action={this.quickLoad}
                            disabled={this.state.disableQuickLoad} />

                <MenuButton text={this.props.app.lang.menu.pause}
                            action={this.showGameMenu()} />
            </div>
        );
    }

    private goBack = (e: React.MouseEvent) => {
        e.stopPropagation();
        this.props.app.gameController.history.previousBlock();
    }

    private quickSave = (e: React.MouseEvent) => {
        e.stopPropagation();
        this.props.app.gameController.quickSave();
    }

    private quickLoad = (e: React.MouseEvent) => {
        e.stopPropagation();
        this.props.app.gameController.quickLoad();
    }

    private showGameMenu = (btn?: GameMenuBtn) => (e: React.MouseEvent) => {
        e.stopPropagation();
        this.props.app.showGameMenu(btn);
    }
}
