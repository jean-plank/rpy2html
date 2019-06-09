import { last } from 'fp-ts/lib/Array';
import { Option } from 'fp-ts/lib/Option';
import * as React from 'react';
import { FunctionComponent } from 'react';

import * as styles from './__style/SaveSlot.css';

import AstNode from '../../nodes/AstNode';
import Save from '../../services/storage/Save';
import blocksFromHistory from '../../utils/blocksFromHistory';
import Game from '../game/Game';

interface Props {
    save: Option<Save>;
    action: (e: React.MouseEvent) => void;
    emptySlot: string; // string for empty slots (instead of save date)
    firstNode: AstNode;
}

const SaveSlot: FunctionComponent<Props> = ({
    save,
    action,
    emptySlot,
    firstNode
}) => {
    const gameRect: JSX.Element = save
        .chain(_ =>
            blocksFromHistory(_.history, [firstNode]).chain(_ =>
                last(_).map(([, _]) => (
                    // tslint:disable-next-line: jsx-key
                    <Game gameProps={_} style={styles.game} />
                ))
            )
        )
        .getOrElse(<div className={styles.emptySlot} />);

    return (
        <div className={styles.saveSlot} onClick={action}>
            {gameRect}
            <div className={styles.text}>
                {save.map(_ => _.date).getOrElse(emptySlot)}
            </div>
        </div>
    );
};
export default SaveSlot;
