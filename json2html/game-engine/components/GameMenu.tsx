import * as React from 'react';
import * as _ from 'lodash';

import '../styles/menus.css';

import App from './App';
import Saves from './Saves';
import Help from './Help';
import MenuButton from './MenuButton';

import IObj from '../classes/IObj';
import Save from '../classes/Save';
import IKeyboardHandler from '../classes/IKeyboardHandler';
import StorageService from '../classes/StorageService';


interface IProps {
    app: App;
    lang: string;
    help: string;
}

interface IState {
    submenu: JSX.Element | null;
    selectedBtn: Btn;
}

enum Btn {
    None,
    Save,
    Load,
    MMenu,
    Help,
}

export default class GameMenu extends React.Component<IProps, IState> implements IKeyboardHandler {
    state: IState = {
        submenu: null,
        selectedBtn: Btn.None,
    };

    private storage: StorageService;

    private constructor (props: IProps) {
        super(props);

        this.storage =
            StorageService.getInstance(props.app);
    }

    render() {
        return (
            <div className='GameMenu'>
                <div className='game-menu-overlay' />
                <div className='menu-items'>
                    <MenuButton text={this.props.app.lang.menu.resume}
                                action={this.hide()} />

                    <MenuButton text={this.props.app.lang.menu.save}
                                action={this.showSave()}
                                selected={this.state.selectedBtn===Btn.Save} />

                    <MenuButton text={this.props.app.lang.menu.load}
                                action={this.showLoad()}
                                selected={this.state.selectedBtn===Btn.Load} />

                    <MenuButton text={this.props.app.lang.menu.mmenu}
                                action={this.confirmMMenu()}
                                selected={this.state.selectedBtn===Btn.MMenu} />

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
            Escape: (evt: React.KeyboardEvent) => {
                evt.stopPropagation();
                this.hide();
            },
        };
        if (_.has(keyEvents, e.key)) keyEvents[e.key](e);
    }

    private hide = () => () => {
        this.props.app.hideGameMenu();
    }

    private showSave = () => () => {
        const save = (iSlot: number) => {
            const props = _.clone(this.props.app.gameController.gameProps);
            const date: string =
                new Date().toLocaleDateString(this.props.app.props.datas.lang,
                                              { day: 'numeric',
                                                month: 'short',
                                                weekday: 'short',
                                                year: 'numeric',
                                                hour: 'numeric',
                                                minute: 'numeric' });
            const nodes = this.props.app.gameController.history.getNodes();

            this.storage.storeSave(Save.fromNodes(props, date, nodes), iSlot);
            this.setState({
                submenu: <Saves app={this.props.app}
                                action={save}
                                saves={this.storage.getSaves()} />
            });
        };

        const saveWithConfirm = (iSlot: number, existingSave: Save | null) => {
            if (existingSave === null) save(iSlot);
            else this.props.app.confirmOverride(() => { save(iSlot); });
        };

        this.setState({ submenu: <Saves app={this.props.app}
                                        action={saveWithConfirm}
                                        saves={this.storage.getSaves()} />,
                        selectedBtn: Btn.Save, });
    }

    private showLoad = () => () => {
        const load = (_iSlot: number, save: Save | null) => {
            if (save === null) return;

            this.props.app.confirmYesNo(
                this.props.app.lang.confirm.unsaved,
                () => {
                    this.props.app.gameController.restoreSave(save.history);
                }
            );
        };

        this.setState({ submenu: <Saves app={this.props.app}
                                        action={load}
                                        saves={this.storage.getSaves()} />,
                        selectedBtn: Btn.Load, });
    }

    private confirmMMenu = () => () => {
        this.setState({ submenu: null,
                        selectedBtn: Btn.MMenu, });
        this.props.app.confirmMMenu(this.unselectBtn());
    }

    private showHelp = () => () => {
        this.setState({ submenu: <Help html={this.props.help} />,
                        selectedBtn: Btn.Help, });
    }

    private unselectBtn = () => () => {
        this.setState({ submenu: null,
                        selectedBtn: Btn.None, });
    }
}
