import * as React from 'react';
import * as _ from 'lodash';

import '../styles/menus.css';

import IObj from '../classes/IObj';
import Save from '../classes/Save';
import IKeyboardHandler from '../classes/IKeyboardHandler';
import StorageService from '../classes/StorageService';

import App from './App';
import MenuButton from './MenuButton';
import SaveSlots from './SaveSlots';
import Memory from './Memory';
import Help from './Help';


interface IProps {
    app: App;
    lang: string;
    help: string;
}

interface IState {
    overlayClassName: string;
    submenu: JSX.Element | null;
    selectedBtn: Btn;
}

enum Btn {
    None,
    Load,
    Memory,
    Help,
}

export default class MainMenu extends React.Component<IProps, IState> implements IKeyboardHandler {
    private static mainMenuOverlay: string = 'main-menu-overlay';
    private static gameMenuOverlay: string = 'game-menu-overlay';

    state: IState = {
        overlayClassName: MainMenu.mainMenuOverlay,
        submenu: null,
        selectedBtn: Btn.None,
    };

    private storage: StorageService;

    constructor (props: IProps) {
        super(props);

        this.storage =
            StorageService.getInstance(props.app);
    }

    render() {
        return (
            <div className='MainMenu'>
                <div className={this.state.overlayClassName} />
                <div className='menu-items'>
                    <MenuButton text={this.props.app.lang.menu.start}
                                action={this.startGame()} />

                    <MenuButton text={this.props.app.lang.menu.load}
                                action={this.showLoad()}
                                selected={this.state.selectedBtn===Btn.Load} />

                    <MenuButton text={this.props.app.lang.menu.memory}
                                action={this.showMemory()}
                                selected={
                                    this.state.selectedBtn===Btn.Memory} />

                    <MenuButton text={this.props.app.lang.menu.help}
                                action={this.showHelp()}
                                selected={this.state.selectedBtn===Btn.Help} />
                </div>
                <div className='submenu'>{this.state.submenu}</div>
            </div>
        );
    }

    onKeyUp(e: React.KeyboardEvent) {
        const keyEvents: IObj<(e: React.KeyboardEvent) => void> = {
            Escape: evt => {
                if (this.state.selectedBtn !== Btn.None) {
                    evt.stopPropagation();
                    this.setState({ overlayClassName: MainMenu.mainMenuOverlay,
                                    submenu: null,
                                    selectedBtn: Btn.None, });
                }
            },
        };
        if (_.has(keyEvents, e.key)) keyEvents[e.key](e);
    }

    private startGame = () => () => {
        this.props.app.startGame();
    }

    private showLoad = () => () => {
        const load = (_iSlot: number, save: Save | null) => {
            if (save === null) return;
            this.props.app.gameController.restoreSave(save.history);
        };

        this.setState({ overlayClassName: MainMenu.gameMenuOverlay,
                        submenu: <SaveSlots app={this.props.app}
                                            action={load}
                                            saves={this.storage.getSaves()} />,
                        selectedBtn: Btn.Load, });
    }

    private showMemory = () => () => {
        this.setState({ overlayClassName: MainMenu.gameMenuOverlay,
                        submenu: <Memory app={this.props.app} />,
                        selectedBtn: Btn.Memory });
    }

    private showHelp = () => () => {
        this.setState({ overlayClassName: MainMenu.gameMenuOverlay,
                        submenu: <Help html={this.props.help} />,
                        selectedBtn: Btn.Help, });
    }
}
