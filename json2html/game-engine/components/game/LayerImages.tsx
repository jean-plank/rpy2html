import * as React from 'react';

import * as styles from './__style/LayerImages.css';

import Image from '../../models/medias/Image';

interface Props {
    images: Image[];
}

export default class LayerImages extends React.Component<Props> {
    render = () => (
        <div className={styles.layerImages} ref={this.setImages()} />
    )

    // keep this method partial (or it won't work)
    private setImages = () => (div: HTMLElement | null) => {
        if (div !== null) {
            div.innerHTML = '';
            this.props.images.forEach(_ =>
                div.appendChild(_.getElt().cloneNode())
            );
        }
    }
}
