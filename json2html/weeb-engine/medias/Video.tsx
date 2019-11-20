/** @jsx jsx */
import { InterpolationWithTheme, jsx } from '@emotion/core'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'

import Media from './Media'

interface Args {
    autoPlay?: boolean
    key?: string | number
    css?: InterpolationWithTheme<any>
}

export default class Video extends Media {
    private _elt: O.Option<HTMLVideoElement> = O.none

    constructor(public name: string, file: string) {
        super(file)
    }

    private setElt = (elt: HTMLVideoElement | null) =>
        (this._elt = O.fromNullable(elt))

    elt = ({ key, autoPlay = true, css }: Args = {}): JSX.Element => (
        <video
            key={key}
            ref={this.setElt}
            css={css}
            src={this.file}
            autoPlay={autoPlay}
        />
    )

    load = () => {
        const elt = document.createElement('video')
        elt.src = this.file
        elt.preload = 'auto'
    }

    onEnded = (f: () => void) =>
        pipe(
            this._elt,
            O.map(_ => (_.onended = f))
        )
}
