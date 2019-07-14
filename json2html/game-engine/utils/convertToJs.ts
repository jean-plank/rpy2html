import { fromNullable } from 'fp-ts/lib/Option'

const convertToJs = (code: string): string =>
    fromNullable(` ${code} `.match(word))
        .map(_ =>
            _.reduce((acc, m) => {
                const trimedM = m.trim()
                if (kwords.indexOf(trimedM) === -1) {
                    return acc.replace(trimedM, `window._${trimedM}`)
                }
                return acc
            }, code).replace('==', '===')
        )
        .getOrElse(code)
export default convertToJs

const word = /\W([a-zA-Z_]\w*)\W/g
const kwords = [
    // 'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do', 'else', 'export', 'extends', 'finally', 'for', 'function', 'if', 'import', 'in', 'instanceof', 'new', 'return', 'super', 'switch', 'this', 'throw', 'try', 'typeof', 'var', 'void', 'while', 'with', 'yield',
    // 'null', 'undefined',
    'true',
    'false'
]
