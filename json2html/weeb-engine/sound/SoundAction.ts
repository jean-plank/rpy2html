import Sound from '../medias/Sound'

export interface Play {
    readonly _tag: 'Play'
    readonly value: Sound
}

export interface Playing {
    readonly _tag: 'Playing'
}

export interface Stop {
    readonly _tag: 'Stop'
}

export type SoundAction = Play | Playing | Stop

export const play = (value: Sound): Play => ({
    _tag: 'Play',
    value
})

export const playing: Playing = { _tag: 'Playing' }

export const stop: Stop = { _tag: 'Stop' }

export const toString = (sa: SoundAction): string =>
    fold({
        onStop: () => 'Stop',
        onPlaying: () => 'Playing',
        onPlay: sound => `Play(${sound})`
    })(sa)

export const isPlay = (sa: SoundAction): sa is Play => sa._tag === 'Play'

interface FoldArgs<A> {
    onStop: () => A
    onPlaying: () => A
    onPlay: (sound: Sound) => A
}
export const fold = <A>({ onStop, onPlaying, onPlay }: FoldArgs<A>) => (
    sa: SoundAction
): A => {
    switch (sa._tag) {
        case 'Stop':
            return onStop()
        case 'Playing':
            return onPlaying()
        case 'Play':
            return onPlay(sa.value)
    }
}
