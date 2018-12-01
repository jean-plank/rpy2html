import * as React from 'react';
import * as _ from 'lodash';

import '../styles/menus.css';

import App from './App';
import SaveSlots from './SaveSlots';
import Help from './Help';
import MenuButton from './MenuButton';

import IObj from '../classes/IObj';
import Save from '../classes/Save';
import IKeyboardHandler from '../classes/IKeyboardHandler';
import StorageService from '../classes/StorageService';
import History from './History';


interface IProps {
    app: App;
    lang: string;
    help: string;
    selectedBtn?: GameMenuBtn;
}

interface IState {
    // submenu: JSX.Element | null;
    selectedBtn: GameMenuBtn;
}

export enum GameMenuBtn {
    None,
    History,
    Save,
    Load,
    MMenu,
    Help,
}

export default class GameMenu extends React.Component<IProps, IState> implements IKeyboardHandler {
    private storage: StorageService;

    private constructor (props: IProps) {
        super(props);

        this.state = {
            // submenu: null,
            selectedBtn:
                props.selectedBtn !== undefined ? props.selectedBtn
                                                : GameMenuBtn.None,
        };

        this.storage = StorageService.getInstance(props.app);
    }

    render() {
        return (
            <div className='GameMenu'>
                <div className='game-menu-overlay' />
                <div className='menu-items'>
                    <MenuButton text={this.props.app.lang.menu.resume}
                                action={this.hide()} />

                    <MenuButton text={this.props.app.lang.menu.history}
                                action={this.selectBtn(GameMenuBtn.History)}
                                selected={this.isSelected(GameMenuBtn.History)}
                            />

                    <MenuButton text={this.props.app.lang.menu.save}
                                action={this.selectBtn(GameMenuBtn.Save)}
                                selected={this.isSelected(GameMenuBtn.Save)} />

                    <MenuButton text={this.props.app.lang.menu.load}
                                action={this.selectBtn(GameMenuBtn.Load)}
                                selected={this.isSelected(GameMenuBtn.Load)} />

                    <MenuButton text={this.props.app.lang.menu.mmenu}
                                action={this.confirmMMenu()}
                                selected={this.isSelected(GameMenuBtn.MMenu)} />

                    <MenuButton text={this.props.app.lang.menu.help}
                                action={this.selectBtn(GameMenuBtn.Help)}
                                selected={this.isSelected(GameMenuBtn.Help)} />
                </div>
                <div className='submenu'>{this.getSubmenu()}</div>
            </div>
        );
    }

    onKeyUp(e: React.KeyboardEvent) {
        const keyEvents: IObj<(e: React.KeyboardEvent) => void> = {
            Escape: (evt: React.KeyboardEvent) => {
                evt.stopPropagation();
                this.hide()();
            },
        };
        if (_.has(keyEvents, e.key)) keyEvents[e.key](e);
    }

    private isSelected(btn: GameMenuBtn): boolean {
        return this.state.selectedBtn === btn;
    }

    private getSubmenu(): JSX.Element | null {
        if (this.state.selectedBtn === GameMenuBtn.History) {
            return this.getHistory();
        }
        if (this.state.selectedBtn === GameMenuBtn.Save) return this.getSave();
        if (this.state.selectedBtn === GameMenuBtn.Load) return this.getLoad();
        if (this.state.selectedBtn === GameMenuBtn.Help) return this.getHelp();
        return null;
    }

    private hide = () => () => {
        this.props.app.hideGameMenu();
    }

    private selectBtn = (btn: GameMenuBtn) => () => {
        this.setState({ selectedBtn: btn });
    }

    private confirmMMenu = () => () => {
        this.selectBtn(GameMenuBtn.MMenu)();
        this.props.app.confirmMMenu(this.unselectBtn());
    }

    private unselectBtn = () => () => {
        this.setState({ selectedBtn: GameMenuBtn.None });
    }

    private getHistory(): JSX.Element {
        return <History nodes={
                            this.props.app.gameController.history.getNodes()
                        } />;
    }

    private getSave(): JSX.Element {
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
            this.forceUpdate();
        };

        const saveWithConfirm = (iSlot: number, existingSave: Save | null) => {
            if (existingSave === null) save(iSlot);
            else this.props.app.confirmOverride(() => { save(iSlot); });
        };

        return <SaveSlots app={this.props.app}
                          action={saveWithConfirm}
                          saves={this.storage.getSaves()} />;
    }

    private getLoad(): JSX.Element {
        const load = (_iSlot: number, save: Save | null) => {
            if (save === null) return;

            this.props.app.confirmYesNo(
                this.props.app.lang.confirm.unsaved,
                () => {
                    this.props.app.gameController.restoreSave(save.history);
                }
            );
        };

        return <SaveSlots app={this.props.app}
                          action={load}
                          saves={this.storage.getSaves()} />;
    }

    private getHelp(): JSX.Element {
        return <Help html={this.props.help} />;
    }
}
