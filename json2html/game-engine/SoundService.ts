import { none, Option } from 'fp-ts/lib/Option';
import { lookup, StrMap } from 'fp-ts/lib/StrMap';

import { sounds } from './context';
import Channel from './models/Channel';
import Sound from './models/medias/Sound';

export default class SoundService {
    private channels: StrMap<Channel>;
    private mainMenuMusic: Option<Sound>;

    constructor(confirmAudio: (okAction: () => void) => void) {
        this.channels = new StrMap({
            music: new Channel(confirmAudio, true, 0.5),
            sound: new Channel(confirmAudio),
            voice: new Channel(confirmAudio)
        });
        this.mainMenuMusic = lookup('main_menu_music', sounds);
        this.mainMenuMusic.map(_ => _.load());
    }

    playMainMenuMusic = () => {
        this.channels.map(_ => _.stop());
        this.mainMenuMusic.map(mainMenuMusic =>
            lookup('music', this.channels).map(_ => _.play(mainMenuMusic))
        );
    }

    pauseChannels = () => this.channels.map(_ => _.pause());

    resumeChannels = () => this.channels.map(_ => _.resume());

    private musicIsntAlreadyPlaying = (
        chanName: string,
        channel: Channel,
        sound: Sound
    ): boolean => !(chanName === 'music' && channel.isAlreadyPlaying(sound))

    applyProps = (sounds: StrMap<Option<Sound>>) => {
        this.channels.mapWithKey((chanName, channel) => {
            lookup(chanName, sounds)
                .getOrElse(none)
                .filter(_ => this.musicIsntAlreadyPlaying(chanName, channel, _))
                .foldL(() => {
                    if (chanName !== 'music') channel.stop();
                }, channel.play);
        });
    }
}
