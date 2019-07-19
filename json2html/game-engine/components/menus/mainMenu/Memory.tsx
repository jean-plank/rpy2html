/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import * as R from 'fp-ts/lib/Record'
import { FunctionComponent, useState } from 'react'

import { storageKey, storagePrefix, style, transl } from '../../../context'
import Obj from '../../../Obj'
import MemoryGame from './MemoryGame'

interface Props {
    emptySaves: () => void
    confirmYesNo: (
        message: string,
        actionYes: () => void,
        actionNo?: () => void
    ) => void
}

const Memory: FunctionComponent<Props> = ({ emptySaves, confirmYesNo }) => {
    const [games, setGames] = useState<Obj<number>>(allJPGamesStorages)

    const gameElts = R.toArray(games).map(([key, bytes], i) => (
        <MemoryGame
            key={i}
            storageKey={key}
            bytes={bytes}
            deleteStorage={deleteStorageWithConfirm(key)}
        />
    ))

    return (
        <div css={styles.memory}>
            <div
                css={styles.header}
                dangerouslySetInnerHTML={{
                    __html: transl.memory.about
                }}
            />
            <div css={styles.games}>
                {gameElts.length > 0 ? gameElts : transl.memory.noGamesYet}
            </div>
            {gameElts.length > 0 ? footer() : null}
        </div>
    )

    function footer(): JSX.Element {
        return (
            <div css={styles.footer}>
                <MemoryGame
                    storageKey={transl.memory.total}
                    bytes={pipe(
                        games,
                        R.reduce(0, (a, b) => a + b)
                    )}
                    deleteStorage={deleteAll}
                    deleteAll={true}
                />
            </div>
        )
    }

    function allJPGamesStorages(): Obj<number> {
        return Object.keys(localStorage)
            .filter(key => key.startsWith(storagePrefix))
            .reduce<Obj<number>>(
                (acc, key) =>
                    pipe(
                        O.fromNullable(localStorage.getItem(key)),
                        O.map(_ =>
                            R.insertAt(
                                key.replace(storagePrefix, ''),
                                byteCount(_)
                            )(acc)
                        ),
                        O.getOrElse(() => acc)
                    ),
                {}
            )
    }

    function deleteStorage(key: string): () => void {
        return () => {
            const keyWithPrefix = storagePrefix + key
            localStorage.removeItem(keyWithPrefix)
            if (keyWithPrefix === storageKey) emptySaves()
            setGames(allJPGamesStorages())
        }
    }

    function deleteStorageWithConfirm(key: string): () => void {
        return () => confirmYesNo(transl.confirm.delete, deleteStorage(key))
    }

    function deleteAll() {
        confirmYesNo(transl.confirm.deleteAll, () =>
            pipe(
                games,
                R.mapWithIndex(_ => deleteStorage(_)())
            )
        )
    }
}
export default Memory

const byteCount = (str: string): number =>
    encodeURI(str).split(/%..|./).length - 1

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
        flexGrow: 1,
        overflowY: 'auto',
        padding: '1.33em 0'
    }),

    footer: css({
        borderTop: '1px solid',
        margin: '0 2em',
        padding: '0 1em'
    })
}
