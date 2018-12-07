import * as _ from 'lodash';

import IObj from '../classes/IObj';
import Node from '../classes/nodes/Node';
import GameProps, { IGameProps, mergeProps } from '../classes/GameProps';
import Sound from '../classes/Sound';
import Block from 'game-engine/classes/Block';


export const convertToJs = (code: string): string => {
    const match = ` ${code} `.match(word);

    return _.reduce(match, (acc: string, m: string) => {
            const trimedM: string = m.trim();

            if (kwords.indexOf(trimedM) === -1) {
                return acc.replace(trimedM, `window._${trimedM}`);
            } else {
                return acc;
            }
        }, code)
        .replace('==', '===');
};


const word = /\W([a-zA-Z_]\w*)\W/g;
const kwords = [
    // 'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do', 'else', 'export', 'extends', 'finally', 'for', 'function', 'if', 'import', 'in', 'instanceof', 'new', 'return', 'super', 'switch', 'this', 'throw', 'try', 'typeof', 'var', 'void', 'while', 'with', 'yield',
    // 'null', 'undefined',
    'true', 'false',
];


export const mapColl = <A, B>(coll: IObj<A>, f: (a: A) => B): IObj<B> => {
    const res: IObj<B> = {};
    _.forEach(_.keys(coll), (key: string) =>
        res[key] = f(coll[key]));
    return res;
};


export const byteCount = (str: string): number => {
    return encodeURI(str).split(/%..|./).length - 1;
};


export const formatNumber = (n: number, lang: string): string => {
    return new Intl.NumberFormat(lang).format(n);
};


export const blocksFromHist = (history: string[],
                               nexts: Node[]): Block[] | null => {
    return blocksFromHistRec(history, nexts,
        null,
        [[], new GameProps(GameProps.empty())],
        []
    );
};

const blocksFromHistRec = (history: string[],
                           nexts: Node[],
                           prev: Node | null,
                           curr: [Node[], GameProps],
                           acc: Block[]): Block[] | null => {

    const head: string | undefined = _.head(history);
    if (head === undefined) return acc;

    const realNexts: Node[] =
        _.filter(nexts, node => node.toString() === head);

    if (realNexts.length === 1) {
        const node: Node = realNexts[0];

        let iProps: IGameProps = curr[1].toIProps();
        if (prev !== null) iProps = mergeProps(iProps, prev.beforeNext(iProps));
        iProps = mergeProps(iProps, node.execute(iProps));

        if (node.stopExecution) {
            const block: Block = [_.concat(curr[0], node), iProps];
            return blocksFromHistRec(_.tail(history), node.nexts(),
                node,
                [[], new GameProps(new GameProps(iProps).cleanedIProps())],
                _.concat(acc, [block])
            );
        } else {
            return blocksFromHistRec(_.tail(history), node.nexts(),
                node,
                [_.concat(curr[0], node), new GameProps(iProps)],
                acc
            );
        }
    } else if (realNexts.length === 0) {
        console.error(
            `Error while restoring save: couldn't find node "${head}"`);
        return null;
    } else {
        console.error(
            `Error while restoring save: find several matching nodes for "${head}":\n`, realNexts);
        return null;
    }
};


export const partialGamePropsToString = (props: Partial<GameProps>): string => {
    const res: any = {};
    _.forEach(props, (val, key) => {
        if (val !== undefined) {
            if (_.isArray(val)) _.map(props.charImgs, elt => elt.toString());
            else if (key === 'sceneImg') {
                res.sceneImg = val !== null ? val.toString() : null;
            } else if (key === 'textboxChar') {
                res.textboxChar = val !== null ? val.toString() : null;
            } else if (key === 'video') {
                res.video = val !== null ? val.toString() : null;
            } else if (key === 'sounds') {
                res.sounds = _.mapValues(val as IObj<Sound | null>,
                    snd => snd !== null ? snd.toString() : null);
            } else res[key] = val;
        }
    });
    return JSON.stringify(res, null, 2);
};
