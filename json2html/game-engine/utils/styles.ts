import { CSSObject } from '@emotion/core'
import { fromNullable } from 'fp-ts/lib/Option'
import { lookup } from 'fp-ts/lib/StrMap'

import { Style } from '../../renpy-json-loader/RenpyJson'
import { images } from '../context'

export const getBgOrElse = (
    img: string,
    color?: string
): CSSObject | undefined => {
    return lookup(img, images)
        .map<CSSObject>(_ => ({
            backgroundColor: 'unset',
            backgroundImage: `url('${_.file}')`
        }))
        .orElse(() => {
            console.warn(`Background image not found: ${img}`)
            return fromNullable(color).map(c => ({ backgroundColor: c }))
        })
        .toUndefined()
}

export const ifOldStyle = (style: CSSObject): CSSObject | undefined =>
    lookup('main_menu_overlay', images).fold(style, _ => undefined)

export const ifNoSlotBg = (style: CSSObject): CSSObject | undefined =>
    lookup('slot_bg', images).fold(style, _ => undefined)

export const mediaQuery = (style: Style): string =>
    `@media (max-aspect-ratio: ${style.game_width} / ${style.game_height})`

export const styleFrom = (str: string): CSSObject | undefined => {
    const [prop, val] = str.split(':', 2)
    return fromNullable(val).fold(undefined, _ => ({
        [camelCase(prop.trimRight())]: val.trimLeft()
    }))
}

const camelCase = (str: string): string => {
    const [head, ...tail] = str.split('-')
    return [head, ...tail.map(firstLetterUpper)].join('')
}

const firstLetterUpper = (str: string): string =>
    str.charAt(0).toUpperCase() + str.slice(1)
