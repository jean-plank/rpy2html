import * as React from 'react';

import App from '../app/App';
import Context from '../app/Context';
import MainMenu from '../components/menus/mainMenu/MainMenu';
import GameService from './game/GameService';
import SoundService from './SoundService';
import StorageService from './storage/StorageService';

interface Args {
    app: App;
    context: Context;
    soundService: SoundService;
    storageService: StorageService;
    gameService: GameService;
}

export default class MainMenuService {
    private app: App;
    private soundService: SoundService;
    private mainMenu: JSX.Element;

    init = ({
        app,
        context,
        soundService,
        storageService,
        gameService
    }: Args) => {
        this.app = app;
        this.soundService = soundService;
        this.mainMenu = (
            <MainMenu
                {...{
                    context,
                    storageService,
                    gameService
                }}
            />
        );
    }

    show = () => {
        this.soundService.playMainMenuMusic();
        this.app.setView(this.mainMenu);
    }
}
