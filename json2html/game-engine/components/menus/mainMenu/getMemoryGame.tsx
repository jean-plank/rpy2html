import * as React from 'react';
import { FunctionComponent } from 'react';

import * as styles from './__style/MemoryGame.css';

import Context from '../../../app/Context';
import formatNumber from '../../../utils/formatNumber';
import MenuButton from '../MenuButton';

export interface Props {
    storageKey: string;
    bytes: number;
    deleteStorage: () => void;
    deleteAll?: boolean;
}

export type MemoryGameType = FunctionComponent<Props>;

const getMemoryGame = ({ transl, lang }: Context): MemoryGameType => ({
    storageKey,
    bytes,
    deleteStorage,
    deleteAll = false
}) => {
    const strBytes = [formatNumber(bytes, lang), transl.bytes].join(' ');
    const strDel = deleteAll ? transl.memory.deleteAll : transl.memory.delete;
    return (
        <div className={styles.memoryGame}>
            <div className={styles.key}>{storageKey}</div>
            <div className={styles.bytes}>{strBytes}</div>
            <MenuButton
                text={'⨯ ' + strDel}
                onClick={deleteStorage}
                className={styles.btn}
            />
        </div>
    );
};
export default getMemoryGame;
