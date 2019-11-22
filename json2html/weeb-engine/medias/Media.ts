import { Interpolation } from '@emotion/core'
import { basename } from 'path'
import { ReactNode } from 'react'

import { HTMLSoundElementT } from './SoundElement'

export default abstract class Media {
    constructor(public name: string, public file: string) {}

    toString = (): string =>
        `${this.constructor.name}("${basename(this.name)}")`

    abstract load(): void
}

export interface Displayable {
    _tag: 'Displayable'

    name: string

    reactNode: (args: {
        key?: string | number
        css?: Interpolation
    }) => NonNullable<ReactNode>
}

export const isDisplayable = (thing: any): thing is Displayable =>
    typeof thing === 'object' && thing._tag === 'Displayable'

export interface Listenable {
    hasSameName: (elt: HTMLSoundElementT) => boolean

    soundElt: (volume?: number, onEnded?: () => void) => HTMLSoundElementT
}
