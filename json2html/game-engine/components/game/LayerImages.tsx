/** @jsx jsx */
import { css, CSSObject, jsx } from '@emotion/core';
import { FunctionComponent } from 'react';

import Image from '../../models/Image';

interface Props {
    images: Image[];
}

const LayerImages: FunctionComponent<Props> = ({ images }) => (
    <div css={layerImagesStyles}>{images.map(img => img.elt(img.file))}</div>
);
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
