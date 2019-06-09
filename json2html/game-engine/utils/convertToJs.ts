import { reduce } from 'lodash';

const convertToJs = (code: string): string => {
    const match = ` ${code} `.match(word);

    return reduce(
        match,
        (acc, m) => {
            const trimedM = m.trim();
            if (kwords.indexOf(trimedM) === -1) {
                return acc.replace(trimedM, `window._${trimedM}`);
            } else {
                return acc;
            }
        },
        code
    ).replace('==', '===');
};
export default convertToJs;

const word = /\W([a-zA-Z_]\w*)\W/g;
const kwords = [
    // 'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do', 'else', 'export', 'extends', 'finally', 'for', 'function', 'if', 'import', 'in', 'instanceof', 'new', 'return', 'super', 'switch', 'this', 'throw', 'try', 'typeof', 'var', 'void', 'while', 'with', 'yield',
    // 'null', 'undefined',
    'true',
    'false'
];
