import * as React from 'react';
import * as _ from 'lodash';

import '../styles/base.css';
import '../styles/App.css';

import parseAppStyle from '../utils/parseAppStyle';
import translations, { ILanguage } from '../utils/translations';

// classes
import IObj from '../classes/IObj';
import IKeyboardHandler from '../classes/IKeyboardHandler';
import GameController from '../classes/GameController';
import IAppDatas from '../classes/IAppDatas';
import Sound from '../classes/Sound';
import Channel from '../classes/Channel';

// components
import MainMenu from './MainMenu';
import GameMenu, { GameMenuBtn } from './GameMenu';
import Confirm from './Confirm';
import { IButton } from './MenuButton';


interface IProps {
    datas: IAppDatas;
}

interface IState {
    view: JSX.Element | null;
    confirm: JSX.Element | null;
}

export default class App extends React.Component<IProps, IState> {
    state: IState = {
        view: null,
        confirm: null,
    };
    channels: IObj<Channel> = {
        music: new Channel(this, true, 0.5),
        sound: new Channel(this),
        voice: new Channel(this),
    };
    gameController: GameController;
    lang: ILanguage;

    private styleContent: string;
    private viewKbrdHndlr: IKeyboardHandler | null = null;
    private confirmKbrdHandler: IKeyboardHandler | null = null;
    private confirmAudioShown: boolean = false;
    private mainMenuMusic: Sound | null = null;

    constructor (props: IProps) {
        super(props);

        this.styleContent = parseAppStyle(props.datas.style,
                                          props.datas.fonts,
                                          props.datas.images);
        this.gameController =
            new GameController(this, props.datas, this.setViewKbrdHndlr());

        this.lang = _.has(translations, props.datas.lang)
            ? translations[props.datas.lang]
            : translations.en;

        if (_.has(props.datas.sounds, 'main_menu_music')) {
            this.mainMenuMusic = props.datas.sounds.main_menu_music;
            (this.mainMenuMusic as Sound).load();
        }

        document.title = props.datas.gameName;
    }

    componentDidMount() {
        this.showMainMenu()();
    }

    render() {
        return (
            <div className='App'
                 tabIndex={0}
                 ref={div => { if (div !== null) div.focus(); }}
                 onKeyUp={this.onKeyUp()}>
                <style>{this.styleContent}</style>
                {this.state.view}
                {this.state.confirm}
            </div>
        );
    }

    private setViewKbrdHndlr = () => (handler: IKeyboardHandler | null) => {
        this.viewKbrdHndlr = handler;
    }

    private setConfirmKbrdHndlr = () => (handler: IKeyboardHandler | null) => {
        this.confirmKbrdHandler = handler;
    }

    private onKeyUp = () => (e: React.KeyboardEvent) => {
        if (this.confirmKbrdHandler !== null)
            this.confirmKbrdHandler.onKeyUp(e);
        else if (this.viewKbrdHndlr !== null)
            this.viewKbrdHndlr.onKeyUp(e);
    }

    // showing views
    showMainMenu = () => () => {
        _.forEach(this.channels, (chan: Channel) => { chan.stop(); });

        if (this.mainMenuMusic !== null)
            this.channels.music.play(this.mainMenuMusic);

        this.setState({
            view: <MainMenu ref={this.setViewKbrdHndlr()}
                            app={this}
                            lang={this.props.datas.lang}
                            help={this.props.datas.help} />
        });
    }

    showGameMenu(gameMenuBtn?: GameMenuBtn) {
        _.forEach(this.channels, (chan: Channel) => { chan.pause(); });

        this.setState({
            view: <GameMenu ref={this.setViewKbrdHndlr()}
                            app={this}
                            lang={this.props.datas.lang}
                            help={this.props.datas.help}
                            selectedBtn={gameMenuBtn} />
        });
    }

    hideGameMenu() {
        _.forEach(this.channels, (chan: Channel) => { chan.resume(); });

        this.gameController.update();
    }

    startGame() {
        this.gameController.start();
    }

    // confirm
    private confirm(msg: string, buttons: IButton[], escapeAction?: () => void) {
        this.setState({
            confirm: <Confirm ref={this.setConfirmKbrdHndlr()}
                              app={this}
                              msg={msg}
                              buttons={buttons}
                              escapeAction={escapeAction} />,
        });
    }

    hideConfirm() {
        this.setState({ confirm: null });
    }

    confirmAudio(okAction: () => void) {
        if (this.confirmAudioShown) return;

        this.confirmAudioShown = true;
        this.confirm(this.lang.confirm.audio,
                     [ { text: this.lang.confirm.audioBtn,
                         action: okAction } ],
                     okAction);
    }

    confirmYesNo(msg: string,
                 actionYes: (e: React.MouseEvent) => void,
                 actionNo?: () => void) {
        this.confirm(msg,
                     [ { text: this.lang.confirm.yes,
                         action: actionYes },
                       { text: this.lang.confirm.no,
                         action: actionNo } ],
                     actionNo);
    }

    confirmMMenu(unselectBtn: () => void) {
        this.confirmYesNo(this.lang.confirm.unsaved,
                          this.showMainMenu(),
                          unselectBtn);
    }

    confirmOverride(save: () => void) {
        this.confirmYesNo(this.lang.confirm.override, save);
    }
}
