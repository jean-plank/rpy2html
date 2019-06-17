import { catOptions } from 'fp-ts/lib/Array';
import { fromNullable, some } from 'fp-ts/lib/Option';
import * as React from 'react';
import { FunctionComponent } from 'react';

import * as styles from './__style/MenuButton.css';

export interface IButton {
    text: string;
    onClick?: (e: React.MouseEvent) => void;
    selected?: boolean;
    disabled?: boolean;
    className?: string;
}

const MenuButton: FunctionComponent<IButton> = ({
    text,
    onClick,
    selected = false,
    disabled,
    className
}) => {
    const classes: string = catOptions([
        some(styles.menuButton),
        some(styles.selected).filter(_ => selected),
        fromNullable(className)
    ]).join(' ');

    return (
        <button className={classes} {...{ onClick, disabled }}>
            {text}
        </button>
    );
};
export default MenuButton;
