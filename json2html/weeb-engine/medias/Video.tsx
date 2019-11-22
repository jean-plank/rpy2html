/** @jsx jsx */
import { ClassNames, Interpolation, jsx } from '@emotion/core'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'

import Media, { Displayable, Listenable } from './Media'

interface Args {
    autoPlay?: boolean
    key?: string | number
    css?: Interpolation
}

export default class Video extends Media implements Displayable, Listenable {
    _tag: 'Displayable' = 'Displayable'

    private elt: O.Option<HTMLVideoElement> = O.none

    private createEltIfNotExists = (): HTMLVideoElement =>
        pipe(
            this.elt,
            O.getOrElse(() => {
                const elt = document.createElement('video')
                elt.src = this.file
                elt.setAttribute('name', this.name)
                elt.preload = 'auto'

                this.elt = O.some(elt)
                return elt
            })
        )

    private setElt = (video: HTMLVideoElement) => (
        container: HTMLDivElement | null
    ): void => {
        if (container !== null && !container.contains(video)) {
            container.innerHTML = ''
            container.appendChild(video)
        }
    }

    reactNode = ({
        key,
        autoPlay = true,
        css: style
    }: Args = {}): JSX.Element => (
        <ClassNames key={key}>
            {({ css }) => {
                const elt = this.createEltIfNotExists()
                elt.autoplay = autoPlay
                elt.className = css(style)
                return <div ref={this.setElt(elt)} />
            }}
        </ClassNames>
    )

    hasSameName = (elt: HTMLVideoElement): boolean =>
        this.name === elt.getAttribute('name')

    soundElt = (volume?: number, onEnded?: () => void): HTMLVideoElement => {
        const elt = this.createEltIfNotExists()
        if (volume !== undefined) this.volume(volume)
        if (onEnded !== undefined) this.onEnded(onEnded)
        return elt
    }

    load = () => {
        this.createEltIfNotExists()
    }

    private volume = (v: number): void => {
        pipe(
            this.elt,
            O.map(_ => (_.volume = v))
        )
    }

    onEnded = (f: () => void): void => {
        pipe(
            this.elt,
            O.map(_ => (_.onended = f))
        )
    }
}
