import Media from './Media';

export default class Sound extends Media {
    constructor(public name: string, file: string) {
        super(file);
    }

    elt = (volume?: number, onEnded?: () => void): HTMLAudioElement => {
        const elt = document.createElement('audio');
        elt.src = this.file;
        elt.setAttribute('name', this.name);
        elt.preload = 'auto';
        if (volume !== undefined) elt.volume = volume;
        if (onEnded !== undefined) elt.onended = onEnded;
        return elt;
    }

    load = () => this.elt();

    hasSameName = (elt: HTMLAudioElement): boolean =>
        this.name === elt.getAttribute('name')

    static play = (elt: HTMLAudioElement): Promise<void> => elt.play();

    static stop = (elt: HTMLAudioElement) => {
        elt.pause();
        elt.currentTime = 0;
    }

    static pause = (elt: HTMLAudioElement) => elt.pause();

    static onEnded = (f: () => void) => (elt: HTMLAudioElement) => {
        elt.onended = f;
    }
}
