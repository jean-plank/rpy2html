import * as $ from 'jquery';


export class Sound {
    private file: string;
    private $audio: JQuery<HTMLAudioElement>;

    constructor (file: string) {
        this.file = file;
    }

    toString(): string {
        return this.file;
    }

    load(): void {
        if (this.$audio == undefined) {
            this.$audio = $(document.createElement("audio"))
                .attr({ src: this.file, preload: 'auto' });
        }
    }

    isLoaded(): boolean {
        return this.$audio != undefined;
    }

    play(volume: number): Promise<void> {
        this.$audio[0].volume = volume;

        return this.$audio[0].play();
    }

    stop(): void {
        this.$audio[0].pause();
        this.$audio[0].currentTime = 0;
    }

    oneEnded(f: () => void): void {
        this.$audio.one("ended", f);
    }
}

export class Sounds {
    [key: string]: Sound;
}
