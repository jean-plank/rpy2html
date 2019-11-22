export interface Play<A> {
    readonly _tag: 'Play'
    readonly value: A
}

export interface Playing {
    readonly _tag: 'Playing'
}

export interface Stop {
    readonly _tag: 'Stop'
}

export type SoundAction<A> = Play<A> | Playing | Stop

export const play = <A>(value: A): SoundAction<A> => ({
    _tag: 'Play',
    value
})

export const playing: SoundAction<never> = { _tag: 'Playing' }

export const stop: SoundAction<never> = { _tag: 'Stop' }

export const toString = <A>(sa: SoundAction<A>): string =>
    fold({
        onStop: () => 'Stop',
        onPlaying: () => 'Playing',
        onPlay: sound => `Play(${sound})`
    })(sa)

export const isPlay = <A>(sa: SoundAction<A>): sa is Play<A> =>
    sa._tag === 'Play'

interface FoldArgs<A, B> {
    onStop: () => B
    onPlaying: () => B
    onPlay: (sound: A) => B
}
export const fold = <A, B>({ onStop, onPlaying, onPlay }: FoldArgs<A, B>) => (
    sa: SoundAction<A>
): B => {
    switch (sa._tag) {
        case 'Stop':
            return onStop()
        case 'Playing':
            return onPlaying()
        case 'Play':
            return onPlay(sa.value)
    }
}
