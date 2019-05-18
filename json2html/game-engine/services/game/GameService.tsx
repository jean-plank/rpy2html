import { isEmpty } from 'fp-ts/lib/Array';
import * as React from 'react';

import App from '../../app/App';
import Context from '../../app/Context';
import { Translation } from '../../app/translations';
import getArmlessWankerMenu, {
    ArmlessWankerMenuType
} from '../../components/game/getArmlessWankerMenu';
import getGame, { GameType } from '../../components/game/getGame';
import AstNode from '../../nodes/AstNode';
import Block from '../../nodes/Block';
import Menu from '../../nodes/Menu';
import GameHistory from '../../store/GameHistory';
import GameProps from '../../store/GameProps';
import blocksFromHistory from '../../utils/blocksFromHistory';
import GameMenuService from '../GameMenuService';
import MainMenuService from '../MainMenuService';
import NotificationsService from '../NotificationsService';
import SoundService from '../SoundService';
import StorageService from '../storage/StorageService';
import followingBlock from './followingBlock';

interface Args {
    app: App;
    context: Context;
    storageService: StorageService;
    notificationsService: NotificationsService;
    soundService: SoundService;
    mainMenuService: MainMenuService;
    gameMenuService: GameMenuService;
}

export default class GameService {
    private app: App;
    private storageService: StorageService;
    private notificationsService: NotificationsService;
    private soundService: SoundService;
    private mainMenuService: MainMenuService;
    private transl: Translation;
    private firstNode: AstNode;
    private history: GameHistory;
    private Game: GameType;
    private ArmlessWankerMenu: ArmlessWankerMenuType;

    init = ({
        app,
        context,
        storageService,
        notificationsService,
        soundService,
        mainMenuService,
        gameMenuService
    }: Args) => {
        this.app = app;
        this.storageService = storageService;
        this.notificationsService = notificationsService;
        this.soundService = soundService;
        this.mainMenuService = mainMenuService;

        const { data, firstNode } = context;
        const gameService = this;
        const mountCallback = this.execThenExecNext(firstNode);
        const showGameMenu = gameMenuService.show(() => this.history.nodes());

        this.Game = getGame({
            gameService,
            showGameMenu,
            mountCallback
        });
        this.ArmlessWankerMenu = getArmlessWankerMenu({
            context,
            gameService,
            showGameMenu
        });

        data.nodes.map(_ =>
            _.init({ data, execThenExecNext: this.execThenExecNext })
        );
        firstNode.loadBlock();
    }

    start = () => {
        this.initHistory();
        this.show();
    }

    show = () =>
        this.app.setView(
            <this.Game
                gameProps={this.history.props().getOrElse(GameProps.empty)}
            />
        )

    update = (gameProps: GameProps) => {
        // video
        gameProps.video.map(_ =>
            _.onEnded(() => {
                if (this.history.nothingToRedo()) this.execNextIfNotMenu();
                else this.history.redo();
            })
        );

        // sounds
        this.soundService.applyProps(gameProps.sounds);

        const armlessWankerMenu = (
            <this.ArmlessWankerMenu
                disableUndo={this.history.nothingToUndo()}
                disableQuickLoad={this.storageService.getQuickSave().isNone()}
            />
        );
        this.app.setView(<this.Game {...{ gameProps, armlessWankerMenu }} />);
    }

    private execThenExecNext = (node: AstNode) => () =>
        this.execute([node, ...followingBlock(node)])

    execNextIfNotMenu = () =>
        this.history.currentNode().map(currentNode => {
            if (!(currentNode instanceof Menu)) this.execNext(currentNode);
        })

    private execNext = (node: AstNode) => this.execute(followingBlock(node));

    private execute = (block: Block) => {
        if (this.history.currentNode().exists(_ => isEmpty(_.nexts()))) {
            return this.mainMenuService.show();
        }
        this.history.addBlock(block);
    }

    private initHistory = () => {
        this.history = new GameHistory();
        this.history.subscribe(this.update);
    }

    historyNodes = (): AstNode[] => this.history.nodes();

    undo = () => this.history.undo();

    redo = () => this.history.redo();

    restoreSave = (history: string[]) => {
        this.initHistory();
        blocksFromHistory(history, [this.firstNode]).map(_ =>
            this.execute(
                _.reduce<Block>((acc, [block]) => acc.concat(block), [])
            )
        );
        // TODO: getOrElse notify "couldn't restore save"
    }

    quickSave = () => {
        this.storageService.storeQuickSave(this.history.nodes());
        this.history.props().map(_ => this.update(_));
        this.notificationsService.notify(this.transl.menu.saved);
    }

    quickLoad = () =>
        this.storageService
            .getQuickSave()
            .map(_ => this.restoreSave(_.history))
}
