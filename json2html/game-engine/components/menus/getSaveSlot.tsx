import { last } from 'fp-ts/lib/Array';
import { fromEither, Option } from 'fp-ts/lib/Option';
import { StrMap } from 'fp-ts/lib/StrMap';
import * as React from 'react';
import { FunctionComponent } from 'react';

import * as styles from './__style/SaveSlot.css';

import { Translation } from '../../app/translations';
import AstNode from '../../nodes/AstNode';
import Save from '../../services/storage/Save';
import Game from '../game/Game';

interface Args {
    nodes: StrMap<AstNode>;
    firstNode: AstNode;
    transl: Translation;
}

interface Props {
    save: Option<Save>;
    action: (e: React.MouseEvent) => void;
}

const getSaveSlot = ({
    nodes,
    firstNode,
    transl
}: Args): FunctionComponent<Props> => ({ save, action }) => {
    const gameRect: JSX.Element = save
        .chain(_ =>
            fromEither(_.blocks(nodes, firstNode)).chain(_ =>
                last(_).map(([_]) => (
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
                {save.map(_ => _.date).getOrElse(transl.emptySlot)}
            </div>
        </div>
    );
};
export default getSaveSlot;
