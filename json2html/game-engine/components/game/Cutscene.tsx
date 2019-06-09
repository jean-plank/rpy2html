import * as React from 'react';
import { FunctionComponent } from 'react';

import * as styles from './__style/Cutscene.css';

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
    return <div ref={setVideo} className={styles.cutscene} />;
};
export default Cutscene;
