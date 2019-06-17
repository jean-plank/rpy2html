import { StrMap, toArray } from 'fp-ts/lib/StrMap';
import * as React from 'react';
import { FunctionComponent, useState } from 'react';

import * as styles from './__style/Memory.css';

import Context from '../../../app/Context';
import StorageService from '../../../services/storage/StorageService';
import getMemoryGame from './getMemoryGame';

interface Args {
    context: Context;
    storageService: StorageService;
}

export type MemoryType = FunctionComponent;

const getMemory = ({ context, storageService }: Args): MemoryType => {
    const MemoryGame = getMemoryGame(context);

    return () => {
        const [games, setGames] = useState<StrMap<number>>(
            storageService.allJPGamesStorages()
        );
        const [total, gameElts] = getTotalAndGameElts(games);

        return (
            <div className={styles.memory}>
                <div
                    className={styles.header}
                    dangerouslySetInnerHTML={{
                        __html: context.transl.memory.about
                    }}
                />
                <div className={styles.games}>
                    <div>
                        {gameElts.length > 0
                            ? gameElts
                            : context.transl.noGamesYet}
                    </div>
                </div>
                {gameElts.length > 0 ? footer() : null}
            </div>
        );

        function deleteStorage(key: string): () => void {
            return () => {
                storageService.removeItem(key);
                setGames(storageService.allJPGamesStorages());
            };
        }

        function getTotalAndGameElts(
            games: StrMap<number>
        ): [number, JSX.Element[], number] {
            return toArray(games).reduce<[number, JSX.Element[], number]>(
                ([sum, elts, i], [key, bytes]) => [
                    sum + bytes,
                    [
                        ...elts,
                        <MemoryGame
                            key={i}
                            storageKey={key}
                            bytes={bytes}
                            deleteStorage={deleteStorage(key)}
                        />
                    ],
                    i + 1
                ],
                [0, [], 0]
            );
        }

        function footer(): JSX.Element {
            return (
                <div className={styles.footer}>
                    <MemoryGame
                        storageKey={context.transl.memory.total}
                        bytes={total}
                        deleteStorage={deleteAll}
                        deleteAll={true}
                    />
                </div>
            );
        }

        function deleteAll() {
            games.mapWithKey(key => deleteStorage(key)());
        }
    };
};
export default getMemory;
