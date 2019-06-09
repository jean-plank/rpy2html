import { fromNullable, none, Option } from 'fp-ts/lib/Option';
import { lookup } from 'fp-ts/lib/StrMap';
import * as React from 'react';

import * as styles from './__style/App.css';
import './__style/base.css';

import RenpyJson from '../../renpy-json-loader/RenpyJson';
import AppData from '../app/AppData';
import ConfirmService from '../services/ConfirmService';
import GameService from '../services/game/GameService';
import GameMenuService from '../services/GameMenuService';
import MainMenuService from '../services/MainMenuService';
import NotificationsService from '../services/NotificationsService';
import SoundService from '../services/SoundService';
import StorageService from '../services/storage/StorageService';
import Context from './Context';
import parseStyle from './parseStyle';

interface Props {
    renpyJson: RenpyJson;
}

interface State {
    view: JSX.Element;
    confirm: Option<JSX.Element>;
}

export default class App extends React.Component<Props, State> {
    state: State = {
        view: <div />,
        confirm: none
    };

    private mainMenuService: MainMenuService;
    private notificationsService: NotificationsService;

    constructor(props: Props) {
        super(props);

        const context = Context.fromRenpyJson(props.renpyJson);
        const app = this;

        initDom(context.data);

        const confirmService = new ConfirmService();
        const gameService = new GameService();
        const gameMenuService = new GameMenuService();
        const mainMenuService = new MainMenuService();
        const notificationsService = new NotificationsService();
        const soundService = new SoundService();
        const storageService = new StorageService();
        this.mainMenuService = mainMenuService;
        this.notificationsService = notificationsService;

        confirmService.init({
            app,
            context,
            mainMenuService
        });
        gameService.init({
            app,
            context,
            storageService,
            notificationsService,
            soundService,
            mainMenuService,
            gameMenuService
        });
        gameMenuService.init({
            app,
            context,
            soundService,
            storageService,
            confirmService,
            gameService,
            gameMenuService
        });
        mainMenuService.init({
            app,
            context,
            soundService,
            storageService,
            gameService
        });
        notificationsService.init({});
        soundService.init({
            context,
            confirmService
        });
        storageService.init({ context });
    }

    componentDidMount = () => this.mainMenuService.show();

    render = () => (
        <div className={styles.container}>
            {this.state.view}
            {this.notificationsService.element}
            {this.state.confirm.toNullable()}
        </div>
    )

    setView = (view: JSX.Element) => this.setState({ view });
    setConfirm = (confirm: Option<JSX.Element>) => this.setState({ confirm });
}

const initDom = (data: AppData) => {
    document.title = data.gameName;
    document.head.appendChild(parseStyle(data.style, data.fonts, data.images));
    lookup('game_icon', data.images).map(
        icon =>
            (fromNullable(document.querySelector(
                'link[rel*="icon"]'
            ) as HTMLLinkElement).getOrElseL(() => {
                const link = document.createElement('link');
                link.rel = 'shortcut icon';
                document.head.appendChild(link);
                return link;
            }).href = icon.file)
    );
};
