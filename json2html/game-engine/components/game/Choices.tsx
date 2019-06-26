/** @jsx jsx */
import { css, jsx, SerializedStyles } from '@emotion/core';
import { TextAlignProperty } from 'csstype';
import { FunctionComponent } from 'react';

import { style } from '../../context';
import { getBgOrElse, mediaQuery, styleFrom } from '../../utils/styles';

interface Props {
    choices: Choice[];
    styleOverload?: {
        choice?: SerializedStyles;
    };
}

interface Choice {
    text: string;
    onClick: (e: React.MouseEvent) => void;
}

const Choices: FunctionComponent<Props> = ({ choices, styleOverload = {} }) => (
    <div css={styles.choices}>
        {choices.map((choice, i) => (
            <button
                key={i}
                css={[styles.choice, styleOverload.choice]}
                onClick={choice.onClick}
            >
                {choice.text}
            </button>
        ))}
    </div>
);
export default Choices;

const styles = {
    choices: css({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        width: '100%',
        height: style.choice_height,
        ...styleFrom(style.choice_yalign)
    }),

    choice: css({
        margin: '0.5em 0',
        color: style.choicebtn_color,
        width: style.choicebtn_width,
        padding: style.choicebtn_padding,
        fontFamily: style.choicebtn_ffamily,
        fontSize: `${style.choicebtn_fsize_h}vh`,
        textAlign: style.choicebtn_txtalign as TextAlignProperty,
        ...styleFrom(style.choicebtn_bgtile),
        ...getBgOrElse('choice_btn_bg', 'rgba(0, 0, 0, 0.75)'),
        [mediaQuery(style)]: {
            fontSize: `${style.choicebtn_fsize_v}vw`
        },
        ':hover': {
            color: style.choicebtn_color_hover,
            ...getBgOrElse('choice_btn_hover', 'rgba(0, 153, 204, 0.75)')
        },
        ':disabled': {
            color: style.disabledbtn_color
        }
    })
};
