import { none, Option, some } from 'fp-ts/lib/Option';
import { lookup, StrMap } from 'fp-ts/lib/StrMap';

import Context from '../app/Context';
import Channel from '../models/Channel';
import Sound from '../models/medias/Sound';
import ConfirmService from './ConfirmService';

interface Args {
    context: Context;
    confirmService: ConfirmService;
}

export default class SoundService {
    private channels: StrMap<Channel>;
    private mainMenuMusic: Option<Sound>;

    init = ({ context: { data }, confirmService }: Args) => {
        this.channels = new StrMap({
            music: new Channel(confirmService.confirmAudio, true, 0.5),
            sound: new Channel(confirmService.confirmAudio),
            voice: new Channel(confirmService.confirmAudio)
        });
        this.mainMenuMusic = lookup('main_menu_music', data.sounds);
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
            const maybePlay: Option<Sound> = lookup(chanName, sounds).chain(_ =>
                _.chain(sound =>
                    this.musicIsntAlreadyPlaying(chanName, channel, sound)
                        ? some(sound)
                        : none
                )
            );
            maybePlay.map(_ => channel.play(_)).getOrElseL(channel.stop);
        });
    }
}
