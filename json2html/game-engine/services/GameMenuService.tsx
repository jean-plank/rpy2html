import * as React from 'react';

import App from '../app/App';
import Context from '../app/Context';
import GameMenuBtn from '../components/menus/gameMenu/GameMenuBtn';
import getGameMenu, {
    GameMenuType
} from '../components/menus/gameMenu/getGameMenu';
import AstNode from '../nodes/AstNode';
import ConfirmService from './ConfirmService';
import GameService from './game/GameService';
import SoundService from './SoundService';
import StorageService from './storage/StorageService';

interface Args {
    app: App;
    context: Context;
    soundService: SoundService;
    storageService: StorageService;
    confirmService: ConfirmService;
    gameService: GameService;
    gameMenuService: GameMenuService;
}

export default class GameMenuService {
    private app: App;
    private soundService: SoundService;
    private gameService: GameService;
    private GameMenu: GameMenuType;

    init = ({
        app,
        context,
        soundService,
        storageService,
        confirmService,
        gameService,
        gameMenuService
    }: Args) => {
        this.app = app;
        this.soundService = soundService;
        this.gameService = gameService;
        this.GameMenu = getGameMenu({
            context,
            storageService,
            confirmService,
            gameMenuService,
            gameService
        });
    }

    show = (getHistory: () => AstNode[]) => (selectedBtn?: GameMenuBtn) => {
        this.soundService.pauseChannels();
        this.app.setView(<this.GameMenu {...{ getHistory, selectedBtn }} />);
    }

    hide = () => {
        this.soundService.resumeChannels();
        this.gameService.show();
    }
}
