import { SerializedStyles } from '@emotion/core'
import { css, cx } from 'emotion'
import { RefObject, useEffect, useMemo } from 'react'

const useAnimation = (
    ref: RefObject<HTMLElement>,
    key: string | number,
    styles: SerializedStyles,
    durationMs: number,
    playing = true
) => {
    const stylesClass = useMemo(() => cx(css(styles)), [styles])

    useEffect(onMount, [key, styles])

    function onMount() {
        if (playing && ref.current !== null) addClass(ref.current, stylesClass)
    }

    function addClass(elt: HTMLElement, className: string) {
        elt.classList.add(className)

        setTimeout(removeClass(elt, className), durationMs)
    }

    function removeClass(elt: HTMLElement, className: string): () => void {
        return () => {
            elt.classList.remove(className)
        }
    }
}
export default useAnimation
