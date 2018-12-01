import * as React from 'react';

import '../styles/Cutscene.css';

import Video from '../classes/Video';


export interface IProps {
    video: Video;
}

export default class Cutscene extends React.Component<IProps> {
    render() {
        return <div ref={this.setVideo()} className='Cutscene' />;
    }

    private setVideo = () => (elt: HTMLDivElement | null) => {
        if (elt !== null) {
            elt.append(this.props.video.getElt());
            this.props.video.play();
        }
    }
}
