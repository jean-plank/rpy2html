/** @jsx jsx */
import { css, CSSObject, jsx, keyframes } from '@emotion/core';
import { Option } from 'fp-ts/lib/Option';
import { FunctionComponent } from 'react';

import Image from '../../models/Image';

interface Props {
    image: Option<Image>;
}

const LayerScene: FunctionComponent<Props> = ({ image }) => (
    <div css={layerSceneStyles}>{image.map(_ => _.elt()).toNullable()}</div>
);
export default LayerScene;

const layerSceneStyles = css({
    ...common(),

    '& > img': {
        ...common(),
        top: '0',
        left: '0',
        objectFit: 'contain',
        animation: `${fadeIn()} 1s forwards`
    }
});

function common(): CSSObject {
    return {
        position: 'absolute',
        height: '100%',
        width: '100%'
    };
}

function fadeIn() {
    return keyframes({
        from: { opacity: 0 },
        to: { opacity: 1 }
    });
}
