export type HTMLSoundElementT = HTMLAudioElement | HTMLVideoElement

export default class SoundElement {
    static play = (elt: HTMLSoundElementT): Promise<void> => elt.play()

    static stop = (elt: HTMLSoundElementT) => {
        elt.pause()
        elt.currentTime = 0
    }

    static pause = (elt: HTMLSoundElementT) => elt.pause()

    static onEnded = (f: () => void) => (elt: HTMLSoundElementT) => {
        elt.onended = f
    }
}
