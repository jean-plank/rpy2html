/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { FunctionComponent } from 'react';

import { style } from '../../context';
import GuiButton from '../GuiButton';

interface BtnProps {
    onClick: (e: React.MouseEvent) => void;
    selected?: boolean;
    disabled?: boolean;
}

const MenuButton: FunctionComponent<BtnProps> = ({
    onClick,
    selected = false,
    disabled,
    children
}) => (
    <GuiButton
        {...{ onClick, disabled }}
        className={selected ? 'selected' : undefined}
        css={buttonStyles}
    >
        {children}
    </GuiButton>
);
export default MenuButton;

const buttonStyles = css({
    padding: style.guibtn_padding,
    height: style.guibtn_height,

    '&.selected, &.selected:hover': {
        color: style.selected_color
    }
});
