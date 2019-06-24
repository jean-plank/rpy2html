import { css, SerializedStyles } from '@emotion/core';

export default class Font {
    src: string;
    bold: boolean;

    static face = (name: string, { src, bold }: Font): SerializedStyles =>
        css({
            '@font-face': {
                fontFamily: name,
                src: `url('${src}')`,
                ...(bold ? { fontWeight: 'bold' } : {})
            }
        })
}
