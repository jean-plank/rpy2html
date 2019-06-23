/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { FunctionComponent } from 'react';

import { lang, style, transl } from '../../../context';
import MenuButton from '../MenuButton';

export interface Props {
    storageKey: string;
    bytes: number;
    deleteStorage: () => void;
    deleteAll?: boolean;
}

const MemoryGame: FunctionComponent<Props> = ({
    storageKey,
    bytes,
    deleteStorage,
    deleteAll = false
}) => {
    const strDel = deleteAll ? transl.memory.deleteAll : transl.memory.delete;
    return (
        <div css={styles.memoryGame}>
            <div css={styles.key}>{storageKey}</div>
            <div css={styles.bytes}>
                {formatNumber(bytes, lang)} {transl.bytes}
            </div>
            <MenuButton onClick={deleteStorage} css={styles.btn}>
                ⨯ {strDel}
            </MenuButton>
        </div>
    );
};
export default MemoryGame;

const formatNumber = (n: number, lang: string): string =>
    new Intl.NumberFormat(lang).format(n);

const styles = {
    memoryGame: css({
        width: '100%',
        padding: '0 3em',
        display: 'flex',
        alignItems: 'center',

        '& > div': {
            display: 'flex',
            padding: '0.67em 0'
        }
    }),

    key: css({
        flexGrow: 1,
        color: style.accent_color
    }),

    bytes: css({
        justifyContent: 'right',
        padding: '0.67em'
    }),

    btn: css({
        '& > div': {
            padding: 0 // !important
        }
    })
};
