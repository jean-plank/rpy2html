import Media, { Listenable } from './Media'

export default class Sound extends Media implements Listenable {
    soundElt = (volume?: number, onEnded?: () => void): HTMLAudioElement => {
        const elt = document.createElement('audio')
        elt.src = this.file
        elt.setAttribute('name', this.name)
        elt.preload = 'auto'
        if (volume !== undefined) elt.volume = volume
        if (onEnded !== undefined) elt.onended = onEnded
        return elt
    }

    load = (): void => {
        this.soundElt()
    }

    hasSameName = (elt: HTMLAudioElement): boolean =>
        this.name === elt.getAttribute('name')
}
