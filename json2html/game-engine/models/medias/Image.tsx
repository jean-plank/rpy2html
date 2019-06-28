/** @jsx jsx */
import { jsx, SerializedStyles } from '@emotion/core';
import Media from './Media';

interface ImgArgs {
    name: string;
    file: string;
}

interface EltArgs {
    key?: string | number;
    css?: SerializedStyles;
}

export default class Image extends Media {
    name: string;

    constructor({ name, file }: ImgArgs) {
        super(file);
        this.name = name;
    }

    elt = ({ key, css }: EltArgs = {}): JSX.Element => (
        <img key={key} css={css} src={this.file} />
    )

    load = () => (document.createElement('img').src = this.file);
}
