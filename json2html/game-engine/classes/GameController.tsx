import * as React from 'react';
import * as _ from 'lodash';


// classes
import IObj from './IObj';
import IKeyboardHandler from './IKeyboardHandler';
import IGameController from './IGameController';
import IAppDatas from './IAppDatas';
import StoryHistory from './StoryHistory';
import Image from './Image';
import Char from './Char';
import Sound from './Sound';
import Channel from './Channel';
import Choice from './Choice';

// nodes
import Node from './nodes/Node';
import Menu from './nodes/Menu';

// components
import App from '../components/App';
import Game from '../components/Game';
import { IGameProps } from './GameProps';


export default class GameController implements IGameController, IKeyboardHandler {
    app: App;
    gameProps: IGameProps = {
        sceneImg: null,
        charImgs: [],
        textboxHide: false,
        textboxChar: null,
        textboxText: '',
        choices: [],
    };
    history: StoryHistory;
    setHandler: (handler: IKeyboardHandler | null) => void = () => {};

    private nodes: IObj<Node>;
    private currentNode: Node | null = null;

    constructor (app: App, datas: IAppDatas, setHandler: (handler: IKeyboardHandler | null) => void) {
        this.app = app;
        this.setHandler = setHandler;

        this.nodes = datas.nodes;
        _.forEach(this.nodes, (node: Node) => { node.init(this, datas); });

        if (_.has(this.nodes, '0')) this.nodes['0'].loadBlock();
        else throw EvalError('A node with id 0 is needed to start the story.');
    }

    onKeyUp(e: React.KeyboardEvent) {
        const keyEvents: IObj<(e: React.KeyboardEvent) => void> = {
            ArrowUp: () => {},
            ArrowDown: () => {},
            ArrowLeft: () => {},
            ArrowRight: () => {},
            Escape: (evt: React.KeyboardEvent) => {
                evt.stopPropagation();
                this.app.showGameMenu();
            },
            ' ': this.execNextIfNotMenu,
            Enter: this.execNextIfNotMenu,
            Control: () => {},
            Tab: () => {},
            PageUp: this.history.previousBlock,
            PageDown: this.history.nextBlock,
            h: () => {},
            v: () => {},
        };
        if (_.has(keyEvents, e.key)) keyEvents[e.key](e);
    }

    start() {
        this.history = new StoryHistory(this);
        this.execThenExecNext(this.nodes[0]);
    }

    execute(node: Node) {
        node.execute();
        this.currentNode = node;
    }

    executeAndAddToHistory(node: Node) {
        this.execute(node);
        this.history.addNode(node);
    }

    execNextIfNotMenu() {
        if (  this.currentNode !== null
           && !(this.currentNode instanceof Menu))
            this.execNext(this.currentNode);
    }

    execThenExecNext(node: Node) {
        this.executeAndAddToHistory(node);
        if (!node.stopExecution) this.execNext(node);
    }

    // Executes recursively all nodes following this node to next stopping node.
    private execNext(node: Node) {
        const nexts = node.nexts();

        if (nexts.length === 0) this.app.showMainMenu()();
        else {
            let next: Node | null = null;

            if (nexts.length === 1) next = nexts[0];
            else throw EvalError(`Node ${node} has more than one next node.`);

            this.execThenExecNext(next);
        }
    }

    update<K extends keyof IGameProps>(props?: Pick<IGameProps, K>) {
        _.forEach(props, (value, key: K) => { this.gameProps[key] = value; });

        this.app.setState({ view: <Game ref={() => { this.setHandler(this); }}
                                        controller={this}
                                        game={this.gameProps} /> });
    }

    // interface for Nodes
    cleanup() {
        _.forEach(this.app.channels, (chan: Channel) => { chan.stop(); });
        this.update({ choices: [],
                      sceneImg: null,
                      charImgs: [] });
    }

    scene(image: Image) {
        this.update({ sceneImg: image,
                      charImgs: [],
                      textboxChar: null,
                      textboxText: '' });
    }

    show(image: Image) {
        if (this.gameProps.charImgs.indexOf(image) === -1)
            this.update({ charImgs: _.concat(this.gameProps.charImgs, image) });
    }

    hide(image: Image) {
        this.update({
            charImgs: _.filter(this.gameProps.charImgs, img => img !== image)
        });
    }

    say(who: Char | null, what: string) {
        this.update({ textboxChar: who,
                      textboxText: what });
    }

    menu(displayText: string, theChoices: Choice[]) {
        if (displayText === '') this.update({ textboxHide: true,
                                              choices: theChoices });
        else this.update({ textboxChar: null,
                           textboxText: displayText,
                           choices: theChoices });
    }

    afterMenu() {
        this.update({ textboxHide: false,
                      choices: [] });
    }

    play(chanName: string, sound: Sound) {
        if (_.has(this.app.channels, chanName))
            // Normal channels support playing and queueing audio, but only
            // play back one audio file at a time.
            this.app.channels[chanName].play(sound);
        else if (chanName === "audio") {
            // The audio channel supports playing back multiple audio files at
            // one time, but does not support queueing sound or stopping
            // playback.
            // TODO
        }
    }

    stop(chanName: string) {
        if (_.has(this.app.channels, chanName))
            this.app.channels[chanName].stop();
        // else if (chanName === "audio")
        //     // TODO
    }

    // restore save
    restoreSave(history: string[]) {
        this.history = new StoryHistory(this);
        this.restoreRec(history, [this.nodes[0]]);
    }

    private restoreRec(history: string[], nexts: Node[]) {
        const head = _.head(history);
        if (head === undefined) return;

        const realNexts = _.filter(nexts, node => node.toString() === head);
        if (realNexts.length === 1) {
            this.executeAndAddToHistory(realNexts[0]);
            this.restoreRec(_.tail(history), realNexts[0].nexts());
        } else if (realNexts.length === 0)
            console.error(`Error while restoring save: couldn't find node "${head}"`);
        else
            console.error(`Error while restoring save: find several matching nodes for "${head}":\n`, realNexts);
    }
}
