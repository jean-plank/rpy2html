interface FPMonad<T> {
    _tag: string
    value?: T
}

const inspect = <T>(label?: string) => (elt: FPMonad<T>): FPMonad<T> => {
    const monad =
        elt.value === undefined ? [elt._tag] : [`${elt._tag}(`, elt.value, ')']
    console.log(...(label === undefined ? monad : [`${label}:`, ...monad]))
    return elt
}
export default inspect
