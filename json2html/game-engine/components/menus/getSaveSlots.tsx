import { Option } from 'fp-ts/lib/Option';
import * as React from 'react';
import { FunctionComponent } from 'react';

import * as styles from './__style/SaveSlots.css';

import { Translation } from '../../app/translations';

import SaveSlot from './SaveSlot';

import AstNode from '../../nodes/AstNode';
import Save from '../../services/storage/Save';

interface Props {
    action: (iSlot: number, save: Option<Save>) => void;
    saves: Array<Option<Save>>;
}

export type SaveSlotsType = FunctionComponent<Props>;

const getSaveSlots = (
    transl: Translation,
    firstNode: AstNode
): SaveSlotsType => {
    return props => {
        const slots = props.saves.map((save: Option<Save>, i: number) => {
            const action = () => {
                props.action(i, save);
            };
            return (
                <SaveSlot
                    key={i}
                    {...{ save, action, firstNode }}
                    emptySlot={transl.emptySlot}
                />
            );
        });
        return <div className={styles.saveSlots}>{slots}</div>;
    };
};
export default getSaveSlots;
