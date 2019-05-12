import * as React from 'react';
import * as _ from 'lodash';


// classes
import IObj from './IObj';
import IKeyboardHandler from './IKeyboardHandler';
import IGameController from './IGameController';
import GameProps, { IGameProps, mergeProps } from './GameProps';
import IAppDatas from './IAppDatas';
import StoryHistory from './StoryHistory';
import StorageService from './StorageService';
import QuickSave from './QuickSave';

// nodes
import Node from './nodes/Node';
import Menu from './nodes/Menu';

// components
import App from '../components/App';
import Game from '../components/Game';
import ArmlessWankerMenu from '../components/ArmlessWankerMenu';

import { blocksFromHist, partialGamePropsToString } from '../utils/utils';
import Block from './Block';
import Channel from './Channel';


export default class GameController implements IGameController, IKeyboardHandler {
    app: App;
    gameProps: GameProps = new GameProps(GameProps.empty());
    history: StoryHistory;
    setHandler: (handler: IKeyboardHandler | null) => void = () => {};

    private nodes: IObj<Node>;
    private currentNode: Node | null = null;
    private armlessWankerMenu: ArmlessWankerMenu | null = null;
    private storage: StorageService;

    constructor (app: App,
                 datas: IAppDatas,
                 setHandler: (handler: IKeyboardHandler | null) => void) {
        this.app = app;
        this.setHandler = setHandler;

        this.nodes = datas.nodes;
        _.forEach(this.nodes, (node: Node) => { node.init(this, datas); });

        this.storage = StorageService.getInstance(app);

        if (_.has(this.nodes, '0')) this.nodes['0'].loadBlock();
        else throw EvalError('A node with id 0 is needed to start the story.');
    }

    onKeyUp(e: React.KeyboardEvent) {
        e.preventDefault();
        const keyEvents: IObj<(e: React.KeyboardEvent) => void> = {
            ArrowUp: () => {},
            ArrowDown: () => {},
            ArrowLeft: () => {},
            ArrowRight: () => {},
            Escape: () => {
                e.stopPropagation();
                this.showGameMenu();
            },
            ' ': () => { this.execNextIfNotMenu(); },
            Enter: () => { this.execNextIfNotMenu(); },
            Control: () => {},
            Tab: () => {},
            PageUp: () => { this.history.previousBlock(); },
            PageDown: () => { this.history.nextBlock(); },
            h: () => {},
            v: () => {},
            s: () => { this.quickSave(); },
            l: () => { this.quickLoad(); },
        };
        if (_.has(keyEvents, e.key)) keyEvents[e.key](e);
    }

    start() {
        this.history = new StoryHistory(this);
        this.execThenExecNext(this.nodes[0]);
    }

    showGameMenu() {
        this.app.showGameMenu();
    }

    quickSave() {
        const nodes = this.history.getNodes();
        this.storage.storeQuickSave(QuickSave.fromNodes(nodes));
        if (this.armlessWankerMenu !== null) {
            this.armlessWankerMenu.setState({
                disableQuickLoad: this.storage.getQuickSave() === null
            });
        }
        this.app.notify(this.app.lang.menu.saved);
    }

    quickLoad() {
        const qSave = this.storage.getQuickSave();
        if (qSave !== null) this.restoreSave(qSave.history);
    }

    execute = ([nodes, props]: Block) => {
        const node = _.last(nodes);
        if (node !== undefined) {
            if (!node.stopExecution) this.app.showMainMenu();
            else {
                this.setCurrentNode(node);
                this.updateAndRefreshDOM(props);
            }
        }
    }

    setCurrentNode(node: Node) {
        this.currentNode = node;
    }

    private executeAndAddToHistory(block: Block) {
        this.execute(block);
        this.history.addBlock(block);
    }

    execNextIfNotMenu() {
        if (  this.currentNode !== null
           && !(this.currentNode instanceof Menu)) {
            this.execNext(this.currentNode);
        }
    }

    execThenExecNext(node: Node) {
        let props: IGameProps = this.gameProps.cleanedIProps();
        if (this.currentNode !== null) {
            props = mergeProps(props, this.currentNode.beforeNext(props));
        }
        props = mergeProps(props, node.execute(props));

        const block: Block = !node.stopExecution
            ? this.getBlock(this.currentNode, node, [[node], props])
            : [[node], props];

        this.executeAndAddToHistory(block);
    }

    // Executes recursively all nodes following node to next stopping node.
    private execNext(node: Node) {
        const block = this.getBlock(
            this.currentNode,
            node,
            [[], this.gameProps.cleanedIProps()]
        );
        this.executeAndAddToHistory(block);
    }

    private getBlock(prev: Node | null,
                     node: Node,
                     acc: Block): Block {

        const nexts = node.nexts();
        if (nexts.length === 0) return acc;
        else if (nexts.length === 1) {
            let props = acc[1];
            if (prev !== null) {
                props = mergeProps(props, prev.beforeNext(props));
            }
            props = mergeProps(props, nexts[0].execute(props));

            const newAcc: Block = [_.concat(acc[0], nexts[0]), props];

            if (nexts[0].stopExecution) return newAcc;
            else return this.getBlock(node, nexts[0], newAcc);
        } else throw EvalError(`Node ${node} has more than one next node.`);
    }

    private update(gameProps: Partial<IGameProps>) {
        this.gameProps =
            new GameProps(mergeProps(this.gameProps.toIProps(), gameProps));
    }

    private updateAndRefreshDOM(gameProps: Partial<IGameProps>) {
        if (__DEV) {
            console.log(
                `%cexecuting ${partialGamePropsToString(gameProps)}`, 'color: blue; font-wheight: bold');
        }

        // video
        if (  gameProps.video !== undefined && gameProps.video !== null) {
            gameProps.video.onEnded(() => {
                if (this.history.noNextBlock()) this.execNextIfNotMenu();
                else this.history.nextBlock();
            });
        }

        // sounds
        _.forEach(
            this.app.channels,
            (chan: Channel, chanName: string) => {
                if (  gameProps.sounds !== undefined
                   && _.has(gameProps.sounds, chanName)) {
                    // if props has chan
                    const sound = gameProps.sounds[chanName];
                    if (sound !== null) {
                        if (!(  chanName === 'music'
                             && chan.isAlreadyPlaying(sound))) {
                            chan.play(sound);
                        }
                        return;
                    }
                }
                chan.stop();
            }
        );

        this.update(gameProps);
        this.show();
    }

    show() {
        const game: JSX.Element =
            // tslint:disable-next-line: no-void-expression
            <Game ref={() => this.setHandler(this)}
                  controller={this}
                  sceneImg={this.gameProps.sceneImg}
                  charImgs={this.gameProps.charImgs}
                  textboxHide={this.gameProps.textboxHide}
                  textboxChar={this.gameProps.textboxChar}
                  textboxText={this.gameProps.textboxText}
                  choices={this.gameProps.choices}
                  video={this.gameProps.video}
                  armlessWankerMenu={<ArmlessWankerMenu ref={this.setWankerMenu}
                                                        app={this.app} />} />;

        this.app.setState({ view: game });
    }

    private setWankerMenu = (menu: ArmlessWankerMenu | null) => {
        this.armlessWankerMenu = menu;
        if (menu !== null) {
            menu.setState({
                disableQuickLoad: this.storage.getQuickSave() === null
            });
        }
    }

    // restore save
    restoreSave(history: string[]) {
        this.history = new StoryHistory(this);

        const blocks: Block[] | null = blocksFromHist(history, [this.nodes[0]]);

        if (blocks !== null) {
            const lastBlock: Block | undefined = _.last(blocks);
            if (lastBlock !== undefined) {
                const lastNode: Node | undefined = _.last(lastBlock[0]);
                if (lastNode !== undefined) {
                    this.updateAndRefreshDOM(lastBlock[1]);
                    this.setCurrentNode(lastNode);
                }
            }
            return;
        }
        // TODO: else notify "couldn't restore save"
    }
}
