import { basename } from 'path';


export default class Sound {
    private file: string;
    private elt: HTMLAudioElement | null;

    constructor (file: string) {
        this.file = file;
        this.elt = null;
    }

    toString(): string {
        return `Sound("${basename(this.file)}")`;
    }

    load() {
        if (!this.isLoaded()) {
            this.elt = document.createElement('audio');
            this.elt.setAttribute('src', this.file);
            this.elt.setAttribute('preload', 'auto');
        }
    }

    isLoaded(): boolean {
        return this.elt !== null;
    }

    play(volume?: number): Promise<void> {
        this.loadIfNot();
        if (volume !== undefined)
            (this.elt as HTMLAudioElement).volume = volume;
        return (this.elt as HTMLAudioElement).play();
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

    private loadIfNot() {
        if (!this.isLoaded()) {
            this.load();
            console.warn(`${this.toString()} didn't preload correctly. Loaded now.`);
        }
    }
}
