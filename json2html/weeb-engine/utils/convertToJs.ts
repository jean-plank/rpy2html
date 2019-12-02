import falafel from 'falafel'

const convertToJs = (code: string): string =>
    falafel(code.replace('==', '==='), node => {
        if (
            node.type === 'Identifier' &&
            (node.parent.object === undefined || node.parent.object === node)
        ) {
            node.update(`window._${node.name}`)
        }
    }).toString()
export default convertToJs
