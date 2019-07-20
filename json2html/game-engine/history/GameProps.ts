import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import * as R from 'fp-ts/lib/Record'

import Char from '../Char'
import Image from '../medias/Image'
import Sound from '../medias/Sound'
import Video from '../medias/Video'
import MenuItem from '../nodes/MenuItem'
import Obj from '../Obj'

export default class GameProps {
    sceneImg: O.Option<Image>
    charImgs: Image[]
    showWindow: boolean
    textboxHide: boolean
    textboxChar: O.Option<Char>
    textboxText: string
    choices: MenuItem[]
    video: O.Option<Video>
    sounds: Obj<O.Option<Sound>> // key chanName
    audios: Sound[]

    static empty: GameProps = {
        sceneImg: O.none,
        charImgs: [],
        showWindow: true,
        textboxHide: false,
        textboxChar: O.none,
        textboxText: '',
        choices: [],
        video: O.none,
        sounds: {},
        audios: []
    }

    static cleaned = (props: GameProps): GameProps => ({
        ...props,
        textboxHide: false,
        choices: [],
        video: O.none,
        sounds: pipe(
            props.sounds,
            R.mapWithIndex((chanName, sound) =>
                chanName === 'music' ? sound : O.none
            )
        ),
        audios: []
    })

    static toJSON = (props: GameProps): object =>
        Object.entries(props).reduce((acc, [key, val]) => {
            if (Array.isArray(val)) {
                return { ...acc, [key]: val.map(_ => _.toString()) }
            }
            if (isOption(val)) {
                return {
                    ...acc,
                    [key]: pipe(
                        val,
                        O.map(_ => _.toString())
                    )
                }
            }
            if (key === 'sounds') {
                return {
                    ...acc,
                    sounds: pipe(
                        props.sounds,
                        R.map(_ =>
                            pipe(
                                _,
                                O.map(_ => _.toString())
                            ).toString()
                        )
                    )
                }
            }
            return { ...acc, [key]: val }
        }, {})
}

export const isOption = (obj: any): obj is O.Option<any> =>
    pipe(
        O.tryCatch(() => O.fromNullable(obj._tag)),
        O.exists(_ =>
            pipe(
                _,
                O.exists(tag => tag === 'Some' || tag === 'None')
            )
        )
    )