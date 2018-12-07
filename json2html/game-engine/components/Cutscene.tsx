import * as React from 'react';

import '../styles/Cutscene.css';

import Video from '../classes/Video';


export interface IProps {
    video: Video;
    paused?: boolean;
}

export default class Cutscene extends React.Component<IProps> {
    render() {
        return <div ref={this.setVideo} className='Cutscene' />;
    }

    private setVideo = (elt: HTMLDivElement | null) => {
        if (elt !== null) {
            elt.appendChild(this.props.video.getElt());
            if (this.props.paused !== true) this.props.video.play();
        } else this.props.video.pause();
    }
}
