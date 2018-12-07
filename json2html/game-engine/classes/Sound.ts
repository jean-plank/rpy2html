import Media from './Media';


export default class Sound extends Media<HTMLAudioElement> {
    load() {
        if (!this.isLoaded()) {
            this.elt = document.createElement('audio');
            this.elt.setAttribute('src', this.file);
            this.elt.setAttribute('preload', 'auto');
        }
    }

    play(volume?: number): Promise<void> {
        const elt = this.getElt();
        if (volume !== undefined) elt.volume = volume;
        return elt.play();
    }

    stop() {
        if (this.elt !== null) {
            this.elt.pause();
            this.elt.currentTime = 0;
        }
    }

    pause() {
        if (this.elt !== null) this.elt.pause();
    }

    onEnded(f: () => void) {
        this.loadIfNot();
        (this.elt as HTMLAudioElement).onended = f;
    }

    static fromAny(sound: any): Sound | null {
        const file = Media.fileFromAny(sound);
        if (file !== null) return new Sound(file); else return null;
    }
}
