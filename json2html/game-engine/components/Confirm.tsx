import { lookup, StrMap } from 'fp-ts/lib/StrMap';
import * as React from 'react';
import { FunctionComponent } from 'react';

import * as styles from './__style/Confirm.css';

import MenuButton, { IButton } from './menus/MenuButton';

interface Props {
    msg: string;
    buttons: IButton[];
    escapeAction?: () => void;
    hideConfirm: () => void;
}

const Confirm: FunctionComponent<Props> = ({
    msg,
    buttons,
    escapeAction,
    hideConfirm
}) => {
    return (
        <div
            className={styles.confirm}
            tabIndex={0}
            onKeyUp={onKeyUp}
            onClick={onClickBg}
        >
            <div className={styles.frame} onClick={onClickFrame}>
                <div
                    className={styles.msg}
                    dangerouslySetInnerHTML={{ __html: msg }}
                />
                <div className={styles.items}>{buttonsElts()}</div>
            </div>
        </div>
    );

    function onKeyUp(e: React.KeyboardEvent) {
        const keyEvents = new StrMap<(e: React.KeyboardEvent) => void>({
            Escape: onClickBg
        });
        lookup(e.key, keyEvents).map(_ => _(e));
    }

    function onClickBg(e: React.SyntheticEvent) {
        e.stopPropagation();
        if (escapeAction !== undefined) escapeAction();
        hideConfirm();
    }

    function onClickFrame(e: React.MouseEvent) {
        e.stopPropagation();
    }

    function buttonsElts(): JSX.Element[] {
        return buttons.map((btn: IButton, i: number) => {
            const f = (e: React.MouseEvent) => {
                e.stopPropagation();
                if (btn.onClick !== undefined) btn.onClick(e);
                hideConfirm();
            };
            return <MenuButton key={i} text={btn.text} onClick={f} />;
        });
    }
};
export default Confirm;
