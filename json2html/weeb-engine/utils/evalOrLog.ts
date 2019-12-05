export default (label: string, code: string): any => {
    try {
        eval(code)
    } catch (e) {
        console.error(`${label} evaluation error: \n"${code}"\n`, e)
    }
}
