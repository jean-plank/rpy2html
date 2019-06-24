/** @jsx jsx */
import { jsx } from '@emotion/core';

export default class Image {
    file: string;

    constructor(file: string) {
        this.file = file;
    }

    elt = (key?: string | number) => <img key={key} src={this.file} />;

    load = () => document.createElement('img').setAttribute('src', this.file);
}
