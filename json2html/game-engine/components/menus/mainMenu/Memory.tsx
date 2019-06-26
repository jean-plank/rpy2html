/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { fromNullable } from 'fp-ts/lib/Option';
import { insert, StrMap, toArray } from 'fp-ts/lib/StrMap';
import { FunctionComponent, useState } from 'react';

import { storageKey, storagePrefix, style, transl } from '../../../context';
import MemoryGame from './MemoryGame';

interface Props {
    emptySaves: () => void;
    confirmYesNo: (
        message: string,
        actionYes: () => void,
        actionNo?: () => void
    ) => void;
}

const Memory: FunctionComponent<Props> = ({ emptySaves, confirmYesNo }) => {
    const [games, setGames] = useState<StrMap<number>>(allJPGamesStorages);

    const gameElts = toArray(games).map(([key, bytes], i) => (
        <MemoryGame
            key={i}
            storageKey={key}
            bytes={bytes}
            deleteStorage={deleteStorageWithConfirm(key)}
        />
    ));

    return (
        <div css={styles.memory}>
            <div
                css={styles.header}
                dangerouslySetInnerHTML={{
                    __html: transl.memory.about
                }}
            />
            <div css={styles.games}>
                <div>{gameElts.length > 0 ? gameElts : transl.noGamesYet}</div>
            </div>
            {gameElts.length > 0 ? footer() : null}
        </div>
    );

    function footer(): JSX.Element {
        return (
            <div css={styles.footer}>
                <MemoryGame
                    storageKey={transl.memory.total}
                    bytes={games.reduce(0, (a, b) => a + b)}
                    deleteStorage={deleteAll}
                    deleteAll={true}
                />
            </div>
        );
    }

    function allJPGamesStorages(): StrMap<number> {
        return Object.keys(localStorage)
            .filter(key => key.startsWith(storagePrefix))
            .reduce(
                (acc, key) =>
                    fromNullable(localStorage.getItem(key))
                        .map(_ =>
                            insert(
                                key.replace(storagePrefix, ''),
                                byteCount(_),
                                acc
                            )
                        )
                        .getOrElse(acc),
                new StrMap<number>({})
            );
    }

    function deleteStorage(key: string): () => void {
        return () => {
            const keyWithPrefix = storagePrefix + key;
            localStorage.removeItem(keyWithPrefix);
            if (keyWithPrefix === storageKey) emptySaves();
            setGames(allJPGamesStorages());
        };
    }

    function deleteStorageWithConfirm(key: string): () => void {
        return () => confirmYesNo(transl.confirm.delete, deleteStorage(key));
    }

    function deleteAll() {
        confirmYesNo(transl.confirm.deleteAll, () =>
            games.mapWithKey(_ => deleteStorage(_)())
        );
    }
};
export default Memory;

const byteCount = (str: string): number =>
    encodeURI(str).split(/%..|./).length - 1;

const styles = {
    memory: css({
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
    }),

    header: css({
        margin: '0 2em',
        padding: '1em 1em',
        borderBottom: '1px solid',
        borderColor: style.interface_text_color
    }),

    games: css({
        overflowY: 'auto',
        flexGrow: 1,

        '& > div': {
            minHeight: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }
    }),

    footer: css({
        borderTop: '1px solid',
        margin: '0 2em',
        padding: '0 1em'
    })
};
