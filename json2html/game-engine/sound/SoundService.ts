import { none, Option, some } from 'fp-ts/lib/Option'
import { insert, lookup, StrMap } from 'fp-ts/lib/StrMap'

import { sounds } from '../context'
import Sound from '../medias/Sound'
import Channel from './Channel'
import Volumes from './Volumes'

export default class SoundService {
    volumes: Volumes = Volumes.fromStorage()

    private channels: StrMap<Channel>
    private mainMenuMusic: Option<Sound>

    constructor(private confirmAudio: (okAction: () => void) => void) {
        this.channels = new StrMap({
            music: new Channel(confirmAudio, this.volumes.music, true)
        })
        this.mainMenuMusic = lookup('main_menu_music', sounds)
    }

    playMainMenuMusic = () => {
        this.channels.map(_ => _.stop())
        this.mainMenuMusic.map(mainMenuMusic =>
            lookup('music', this.channels).map(_ => _.play(mainMenuMusic))
        )
    }

    stopChannels = () => this.channels.map(_ => _.stop())

    pauseChannels = () => this.channels.map(_ => _.pause())

    resumeChannels = () => this.channels.map(_ => _.resume())

    applySounds = (sounds: StrMap<Option<Sound>>) =>
        sounds.mapWithKey((chanName, sound) =>
            lookup(chanName, this.channels)
                .orElse(() =>
                    sound.isSome() ? some(this.newChannel(chanName)) : none
                )
                .map(channel =>
                    sound.foldL(
                        channel.stop,
                        this.playIfNotMusicAndAlready(chanName, channel)
                    )
                )
        )

    private newChannel = (chanName: string): Channel => {
        const channel = new Channel(
            this.confirmAudio,
            chanName === 'voice' ? this.volumes.voice : this.volumes.sound
        )
        this.channels = insert(chanName, channel, this.channels)
        return channel
    }

    private playIfNotMusicAndAlready = (chanName: string, channel: Channel) => (
        sound: Sound
    ): void => {
        if (!(chanName === 'music' && channel.isAlreadyPlaying(sound))) {
            channel.play(sound)
        }
    }

    applyAudios = (audios: Sound[]) =>
        audios.map(_ => Sound.play(_.elt(this.volumes.sound)))

    setVolume = (chanName: keyof Volumes, volume: number) => {
        this.volumes[chanName] = volume
        Volumes.store(this.volumes)

        if (chanName === 'sound') this.setSoundVolume(volume)
        else this.setChannelVolume(chanName, volume)
    }

    private setSoundVolume = (volume: number) =>
        this.channels.mapWithKey((name, chan) => {
            if (name !== 'music' && name !== 'voice') chan.setVolume(volume)
        })

    private setChannelVolume = (chanName: keyof Volumes, volume: number) =>
        lookup(chanName, this.channels).map(_ => _.setVolume(volume))
}
