/** @jsx jsx */
import { css, CSSObject, jsx } from '@emotion/core';
import { FunctionComponent } from 'react';

import Image from '../../models/medias/Image';

interface Props {
    images: Image[];
}

const LayerImages: FunctionComponent<Props> = ({ images }) => {
    return <div css={layerImagesStyles} ref={setImages()} />;

    // keep this method partial (or it won't work)
    function setImages(): (div: HTMLElement | null) => void {
        return div => {
            if (div !== null) {
                div.innerHTML = '';
                images.forEach(_ => div.appendChild(_.getElt().cloneNode()));
            }
        };
    }
};
export default LayerImages;

const layerImagesStyles = css({
    ...common(),

    '& > img': {
        ...common(),
        top: '0',
        left: '0',
        objectFit: 'contain'
    }
});

function common(): CSSObject {
    return {
        position: 'absolute',
        height: '100%',
        width: '100%'
    };
}
