import { identity } from 'fp-ts/lib/function'
import * as t from 'io-ts'

import fromStorage from '../utils/fromStorage'

const VolumesType = t.exact(
    t.type({
        music: t.number,
        sound: t.number,
        voice: t.number
    })
)
type RawVolumes = t.TypeOf<typeof VolumesType>

export default class Volumes implements RawVolumes {
    music: number
    sound: number
    voice: number

    private static storageKey = 'volumes'

    static fromStorage = (): Volumes =>
        fromStorage(
            Volumes.storageKey,
            VolumesType.decode,
            identity,
            Volumes.default
        )

    private static default: Volumes = {
        music: 0.5,
        sound: 0.7,
        voice: 0.7
    }

    static store = (volumes: Volumes) =>
        localStorage.setItem(
            Volumes.storageKey,
            JSON.stringify(VolumesType.encode(volumes))
        )
}
