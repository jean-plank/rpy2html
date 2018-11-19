import * as _ from 'lodash';

import IObj from '../classes/IObj';


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
