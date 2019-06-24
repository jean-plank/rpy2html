/** @jsx jsx */
import { css, CSSObject, jsx } from '@emotion/core';
import { FunctionComponent } from 'react';

import Video from '../../models/medias/Video';

export interface Props {
    video: Video;
    paused?: boolean;
}

const Cutscene: FunctionComponent<Props> = ({ video, paused = false }) => {
    const setVideo = (elt: HTMLDivElement | null) => {
        if (elt !== null) {
            elt.appendChild(video.getElt());
            if (!paused) video.play();
        } else video.pause();
    };

    return <div ref={setVideo} css={cutsceneStyles} />;
};
export default Cutscene;

const cutsceneStyles = css({
    ...common(),

    '& > video': {
        ...common(),
        objectFit: 'contain'
    }
});

function common(): CSSObject {
    return {
        position: 'absolute',
        width: '100%',
        height: '100%'
    };
}
