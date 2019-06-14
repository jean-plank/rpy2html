import { Option } from 'fp-ts/lib/Option';
import { StrMap } from 'fp-ts/lib/StrMap';
import * as React from 'react';
import { FunctionComponent } from 'react';

import * as styles from './__style/SaveSlots.css';

import { Translation } from '../../app/translations';
import AstNode from '../../nodes/AstNode';
import Save from '../../services/storage/Save';
import getSaveSlot from './getSaveSlot';

interface Props {
    saves: Array<Option<Save>>;
    onClick: (iSlot: number, save: Option<Save>) => void;
}

export type SaveSlotsType = FunctionComponent<Props>;

const getSaveSlots = (
    nodes: StrMap<AstNode>,
    firstNode: AstNode,
    transl: Translation
): SaveSlotsType => {
    const SaveSlot = getSaveSlot({ nodes, firstNode, transl });

    return ({ saves, onClick }) => {
        return (
            <div className={styles.saveSlots}>
                {saves.map((save, i) => (
                    <SaveSlot key={i} save={save} action={getAction(save, i)} />
                ))}
            </div>
        );

        function getAction(save: Option<Save>, i: number): () => void {
            return () => onClick(i, save);
        }
    };
};
export default getSaveSlots;
