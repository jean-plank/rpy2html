/** @jsx jsx */
import { jsx, SerializedStyles } from '@emotion/core'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'

import Media from './Media'

interface Args {
    autoPlay: boolean
    css?: SerializedStyles
}

export default class Video extends Media {
    private _elt: O.Option<HTMLVideoElement> = O.none

    private setElt = (elt: HTMLVideoElement | null) =>
        (this._elt = O.fromNullable(elt))

    elt = ({ autoPlay, css }: Args): JSX.Element => (
        <video
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
