/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { FunctionComponent } from 'react';

import { style } from '../../context';
import Button from '../Button';

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
    <Button
        {...{ onClick, disabled }}
        className={selected ? 'selected' : undefined}
        css={buttonStyles}
    >
        {children}
    </Button>
);
export default MenuButton;

const buttonStyles = css({
    padding: style.guibtn_padding,
    height: style.guibtn_height,

    '&.selected, &.selected:hover': {
        color: style.selected_color
    }
});
