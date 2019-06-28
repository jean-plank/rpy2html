/** @jsx jsx */
import { css } from '@emotion/core';
import { FunctionComponent } from 'react';

import Video from '../../models/medias/Video';

export interface Props {
    video: Video;
    autoPlay: boolean;
}

const Cutscene: FunctionComponent<Props> = ({ video, autoPlay }) =>
    video.elt({ autoPlay, css: videoStyles });
export default Cutscene;

const videoStyles = css({
    position: 'absolute',
    width: '100%',
    height: '100%',
    objectFit: 'contain'
});
