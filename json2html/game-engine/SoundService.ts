import { none, Option, some } from 'fp-ts/lib/Option';
import { insert, lookup, StrMap } from 'fp-ts/lib/StrMap';

import { sounds } from './context';
import Channel from './models/Channel';
import Sound from './models/medias/Sound';

export default class SoundService {
    private channels: StrMap<Channel>;
    private mainMenuMusic: Option<Sound>;

    constructor(private confirmAudio: (okAction: () => void) => void) {
        this.channels = new StrMap({
            music: new Channel(confirmAudio, true, 0.5)
        });
        this.mainMenuMusic = lookup('main_menu_music', sounds);
    }

    playMainMenuMusic = () => {
        this.channels.map(_ => _.stop());
        this.mainMenuMusic.map(mainMenuMusic =>
            lookup('music', this.channels).map(_ => _.play(mainMenuMusic))
        );
    }

    stopChannels = () => this.channels.map(_ => _.stop());

    pauseChannels = () => this.channels.map(_ => _.pause());

    resumeChannels = () => this.channels.map(_ => _.resume());

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
        const channel = new Channel(this.confirmAudio);
        this.channels = insert(chanName, channel, this.channels);
        return channel;
    }

    private playIfNotMusicAndAlready = (chanName: string, channel: Channel) => (
        sound: Sound
    ): void => {
        if (!(chanName === 'music' && channel.isAlreadyPlaying(sound))) {
            channel.play(sound);
        }
    }

    applyAudios = (audios: Sound[]) => audios.map(_ => Sound.play(_.elt()));
}
