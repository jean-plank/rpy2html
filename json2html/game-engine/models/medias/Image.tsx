/** @jsx jsx */
import { jsx, SerializedStyles } from '@emotion/core';
import Media from './Media';

interface Args {
    key?: string | number;
    css?: SerializedStyles;
}

export default class Image extends Media {
    constructor(public name: string, file: string) {
        super(file);
    }

    elt = ({ key, css }: Args = {}): JSX.Element => (
        <img key={key} css={css} src={this.file} />
    )

    load = () => (document.createElement('img').src = this.file);
}
