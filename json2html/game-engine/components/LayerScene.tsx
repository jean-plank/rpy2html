import * as React from 'react';

import '../styles/LayerScene.css';

import Image from '../classes/Image';


interface IProps {
    img: Image | null;
}

export default class LayerScene extends React.Component<IProps> {
    render() {
        return <div className='LayerScene' ref={this.setImage} />;
    }

    private setImage = (div: HTMLDivElement | null) => {
        if (div !== null && this.props.img !== null) {
            div.appendChild(this.props.img.getElt().cloneNode());
        }
    }
}
