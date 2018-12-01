import * as _ from 'lodash';

import { IRawNode } from '../../renpy-json-loader/IRenpyJson';

import Node from '../classes/nodes/Node';
import Hide from '../classes/nodes/Hide';
import If from '../classes/nodes/If';
import IfBlock from '../classes/nodes/IfBlock';
import Menu from '../classes/nodes/Menu';
import MenuItem from '../classes/nodes/MenuItem';
import Play from '../classes/nodes/Play';
import PlayVideo from '../classes/nodes/PlayVideo';
import PyExpr from '../classes/nodes/PyExpr';
import Say from '../classes/nodes/Say';
import Scene from '../classes/nodes/Scene';
import Show from '../classes/nodes/Show';
import Stop from '../classes/nodes/Stop';


export default (rawNode: IRawNode): Node => {
    switch (rawNode.class_name) {
        case 'Hide': return parseHide(rawNode.arguments);
        case 'If': return parseIf(rawNode.arguments);
        case 'IfBlock': return parseIfBlock(rawNode.arguments);
        case 'Menu': return parseMenu(rawNode.arguments);
        case 'MenuItem': return parseMenuItem(rawNode.arguments);
        case 'Play': return parsePlay(rawNode.arguments);
        case 'PyExpr': return parsePyExpr(rawNode.arguments);
        case 'Video': return parseVideo(rawNode.arguments);
        case 'Say': return parseSay(rawNode.arguments);
        case 'Scene': return parseScene(rawNode.arguments);
        case 'Show': return parseShow(rawNode.arguments);
        case 'Stop': return parseStop(rawNode.arguments);
    }
    throw new EvalError(`JSON: unknown node class_name: ${rawNode.class_name}`);
};


const unknownArgsError = (className: string,
                          args: any[]): EvalError => {
    return EvalError(
        `JSON: unknown arguments for classe ${className}: ${args.join(', ')}`);
};

const isValidIdNext = (idNext: any): boolean => {
    return (  idNext === null
           || (  _.isArray(idNext)
              && _.every(idNext, _.isString)));
};

const checkNodeImgArgs = (className: string,
                          args: any[]) :
                              [string, number[] | null | undefined] => {
    if (args.length <= 2) {
        let imgName: string | undefined;
        let idNext: number[] | null | undefined = null;

        if (_.isString(args[0])) imgName = args[0];
        if (isValidIdNext(args[1])) idNext = args[1];

        if (imgName !== undefined) {
            return [imgName, idNext];
        }
    }
    throw unknownArgsError(className, args);
};

/**
 * parsers
 */
const parseHide = (args: any[]): Hide => {
    const [imgName, idNext] = checkNodeImgArgs('Hide', args);
    return new Hide(imgName, idNext);
};

const parseIf = (args: any[]): If => {
    if (args.length <= 1) {
        let idNext: number[] | null | undefined;

        if (isValidIdNext(args[0])) idNext = args[0];

        return new If(idNext);
    }
    throw unknownArgsError('If', args);
};

const parseIfBlock = (args: any[]): IfBlock => {
    if (args.length <= 2) {
        let condition: string | undefined;
        let idNext: number[] | null | undefined;

        if (_.isString(args[0])) condition = args[0];
        if (isValidIdNext(args[1])) idNext = args[1];

        if (condition !== undefined) {
            return new IfBlock(condition, idNext);
        }
    }
    throw unknownArgsError('IfBlock', args);
};

const parseMenu = (args: any[]): Menu => {
    // TODO: correct menu with caption parsing
    if (args.length <= 2) {
        let displayTxt: string | undefined;
        let idNext: number[] | null | undefined;

        if (_.isString(args[0])) displayTxt = args[0];
        if (isValidIdNext(args[1])) idNext = args[1];

        if (displayTxt !== undefined) {
            return new Menu(null, displayTxt, idNext);
        }
    }
    throw unknownArgsError('Menu', args);
};

const parseMenuItem = (args: any[]): MenuItem => {
    if (args.length <= 3) {
        let text: string | undefined;
        let condition: string | undefined;
        let idNext: number[] | null | undefined;

        if (_.isString(args[0])) text = args[0];
        if (_.isString(args[1])) condition = args[1];
        if (isValidIdNext(args[2])) idNext = args[2];

        if (text !== undefined) {
            return new MenuItem(text, condition, idNext);
        }
    }
    throw unknownArgsError('MenuItem', args);
};

const parsePlay = (args: any[]): Play => {
    if (args.length <= 3) {
        let chanName: string | undefined;
        let sndName: string | undefined;
        let idNext: number[] | null | undefined;

        if (_.isString(args[0])) chanName = args[0];
        if (_.isString(args[1])) sndName = args[1];
        if (isValidIdNext(args[2])) idNext = args[2];

        if (chanName !== undefined && sndName !== undefined) {
            return new Play(chanName, sndName, idNext);
        }
    }
    throw unknownArgsError('Play', args);
};

const parsePyExpr = (args: any[]): PyExpr => {
    if (args.length <= 2) {
        let code: string | undefined;
        let idNext: number[] | null | undefined;

        if (_.isString(args[0])) code = args[0];
        if (isValidIdNext(args[1])) idNext = args[1];

        if (code !== undefined) {
            return new PyExpr(code, idNext);
        }
    }
    throw unknownArgsError('PyExpr', args);
};

const parseVideo = (args: any[]): PlayVideo => {
    if (args.length <= 2) {
        let vidName: string | undefined;
        let idNext: number[] | null | undefined;

        if (_.isString(args[0])) vidName = args[0];
        if (isValidIdNext(args[1])) idNext = args[1];

        if (vidName !== undefined) {
            return new PlayVideo(vidName, idNext);
        }
    }
    throw unknownArgsError('PlayVideo', args);
};

const parseSay = (args: any[]): Say => {
    if (args.length <= 3) {
        let whosName: string | undefined | null;
        let what: string | undefined;
        let idNext: number[] | null | undefined;

        if (_.isString(args[0]) || args[0] === null) whosName = args[0];
        if (_.isString(args[1])) what = args[1];
        if (isValidIdNext(args[2])) idNext = args[2];

        if (whosName !== undefined && what !== undefined) {
            return new Say(whosName, what, idNext);
        }
    }
    throw unknownArgsError('Say', args);
};

const parseScene = (args: any[]): Scene => {
    const [imgName, idNext] = checkNodeImgArgs('Scene', args);
    return new Scene(imgName, idNext);
};

const parseShow = (args: any[]): Show => {
    const [imgName, idNext] = checkNodeImgArgs('Show', args);
    return new Show(imgName, idNext);
};

const parseStop = (args: any[]): Stop => {
    if (args.length <= 2) {
        let chanName: string | undefined;
        let idNext: number[] | null | undefined;

        if (_.isString(args[0])) chanName = args[0];
        if (isValidIdNext(args[1])) idNext = args[1];

        if (chanName !== undefined) {
            return new Stop(chanName, idNext);
        }
    }
    throw unknownArgsError('Stop', args);
};
