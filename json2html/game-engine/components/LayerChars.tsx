import * as React from 'react';
import * as _ from 'lodash';

import '../styles/LayerChars.css';

import Image from '../classes/Image';


interface IProps {
    imgs: Image[];
}

export default class LayerChars extends React.Component<IProps> {
    render() {
        return <div className='LayerChars' ref={this.setImages()} />;
    }

    // keep this method partial (or it won't work)
    private setImages = () => (div: HTMLElement | null) => {
        if (div !== null) {
            div.innerHTML = '';
            _.forEach(this.props.imgs, img => {
                div.appendChild(img.getElt().cloneNode());
            });
        }
    }
}