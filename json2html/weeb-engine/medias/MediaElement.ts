export default class MediaElement {
    static stop = (elt: HTMLMediaElement) => {
        elt.pause()
        elt.currentTime = 0
    }

    static pause = (elt: HTMLMediaElement) => elt.pause()

    static onEnded = (f: () => void) => (elt: HTMLMediaElement) => {
        elt.onended = f
    }
}
