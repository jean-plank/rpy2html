import { Option } from 'fp-ts/lib/Option';
import * as React from 'react';

import * as styles from './__style/LayerScene.css';

import Image from '../../models/medias/Image';

interface IProps {
    image: Option<Image>;
}

export default class LayerScene extends React.Component<IProps> {
    render = () => <div className={styles.layerScene} ref={this.setImage()} />;

    // keep this method partial (or it won't work)
    private setImage = () => (div: HTMLDivElement | null) =>
        this.props.image.map(_ => {
            if (div !== null) div.appendChild(_.getElt().cloneNode());
        })
}
