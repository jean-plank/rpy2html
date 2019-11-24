import { CSSObject } from '@emotion/core'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import * as R from 'fp-ts/lib/Record'

import Style from '../../renpy-json-loader/Style'
import { images } from '../context'

export const getBgOrElse = (
    img: string,
    color?: string
): CSSObject | undefined =>
    pipe(
        R.lookup(img, images),
        O.map(_ => ({
            backgroundColor: 'unset',
            backgroundImage: `url('${_.file}')`
        })),
        O.alt(() => {
            console.warn(`Background image not found: ${img}`)
            return pipe(
                O.fromNullable(color),
                O.map(c => ({ backgroundColor: c }))
            )
        }),
        O.toUndefined
    )

export const ifOldStyle = (style: CSSObject): CSSObject | undefined =>
    pipe(
        R.lookup('main_menu_overlay', images),
        O.fold(
            () => style,
            _ => undefined
        )
    )

export const ifNoSlotBg = (style: CSSObject): CSSObject | undefined =>
    pipe(
        R.lookup('slot_bg', images),
        O.fold(
            () => style,
            _ => undefined
        )
    )

export const mediaQuery = (style: Style): string =>
    `@media (max-aspect-ratio: ${style.game_width} / ${style.game_height})`

export const styleFrom = (str: string): CSSObject | undefined => {
    const [prop, val] = str.split(':', 2)
    return pipe(
        O.fromNullable(val),
        O.fold(
            () => undefined,
            _ => ({
                [camelCase(prop.trimRight())]: val.trimLeft()
            })
        )
    )
}

const camelCase = (str: string): string => {
    const [head, ...tail] = str.split('-')
    return [head, ...tail.map(firstLetterUpper)].join('')
}

const firstLetterUpper = (str: string): string =>
    str.charAt(0).toUpperCase() + str.slice(1)
