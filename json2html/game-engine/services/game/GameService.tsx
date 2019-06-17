import { isEmpty } from 'fp-ts/lib/Array';
import * as React from 'react';
import { createRef, RefObject } from 'react';

import App from '../../app/App';
import Context from '../../app/Context';
import getArmlessWankerMenu, {
    ArmlessWankerMenuType
} from '../../components/game/getArmlessWankerMenu';
import getGame, { GameType } from '../../components/game/getGame';
import AstNode from '../../nodes/AstNode';
import Menu from '../../nodes/Menu';
import GameHistory from '../../store/GameHistory';
import GameProps from '../../store/GameProps';
import GameMenuService from '../GameMenuService';
import KeyUpAble from '../KeyUpAble';
import MainMenuService from '../MainMenuService';
import NotificationsService from '../NotificationsService';
import Service from '../Service';
import SoundService from '../SoundService';
import QuickSave from '../storage/QuickSave';
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

export default class GameService implements Service {
    keyUpAble: RefObject<KeyUpAble> = createRef();

    private app: App;
    private context: Context;
    private storageService: StorageService;
    private notificationsService: NotificationsService;
    private soundService: SoundService;
    private mainMenuService: MainMenuService;
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
        this.context = context;
        this.storageService = storageService;
        this.notificationsService = notificationsService;
        this.soundService = soundService;
        this.mainMenuService = mainMenuService;

        const { data, firstNode } = context;
        const gameService = this;
        const showGameMenu = gameMenuService.show(() => this.history.nodes());

        this.Game = getGame({
            gameService,
            showGameMenu
        });
        this.ArmlessWankerMenu = getArmlessWankerMenu({
            context,
            gameService,
            showGameMenu
        });

        data.nodes.mapWithKey((id, node) =>
            node.init({ id, data, execThenExecNext: this.execThenExecNext })
        );
        firstNode.loadBlock();
    }

    start = () => {
        this.initHistory();
        this.execThenExecNext(this.context.firstNode)();
    }

    show = () => {
        this.update(this.history.props().getOrElse(GameProps.empty));
    }

    private update = (gameProps: GameProps) => {
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
        this.app.setView(
            this,
            <this.Game
                ref={this.keyUpAble}
                {...{ gameProps, armlessWankerMenu }}
            />
        );
    }

    execThenExecNext = (node: AstNode) => () =>
        this.execute([node, ...followingBlock(node)])

    execNextIfNotMenu = () =>
        this.history.currentNode().map(currentNode => {
            if (!(currentNode instanceof Menu)) this.execNext(currentNode);
        })

    private execNext = (node: AstNode) => this.execute(followingBlock(node));

    private execute = (block: AstNode[]) => {
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

    restoreSave = (save: QuickSave) => {
        this.initHistory();
        save.blocks(this.context.firstNode)
            .map(_ => this.history.setPast(_))
            .mapLeft(error => {
                console.error(error);
                this.notificationsService.notify("Couldn't restore save");
            });
    }

    quickSave = () => {
        this.storageService.storeQuickSave(this.history.nodes());
        this.history.props().map(_ => this.update(_));
        this.notificationsService.notify(this.context.transl.menu.saved);
    }

    quickLoad = () => this.storageService.getQuickSave().map(this.restoreSave);
}
