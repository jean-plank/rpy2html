/** @jsx jsx */
import { jsx, SerializedStyles } from '@emotion/core'
import { fromNullable, none, Option } from 'fp-ts/lib/Option'

import Media from './Media'

interface Args {
    autoPlay: boolean
    css?: SerializedStyles
}

export default class Video extends Media {
    private _elt: Option<HTMLVideoElement> = none

    private setElt = (elt: HTMLVideoElement | null) =>
        (this._elt = fromNullable(elt))

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

    onEnded = (f: () => void) => this._elt.map(_ => (_.onended = f))
}
