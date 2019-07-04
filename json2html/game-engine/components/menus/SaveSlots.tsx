/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Option } from 'fp-ts/lib/Option';
import { FunctionComponent } from 'react';

import Save from '../../storage/Save';
import SaveSlot from './SaveSlot';

interface Props {
    saves: Array<Option<Save>>;
    onClick: (slot: number, save: Option<Save>) => void;
    deleteSave: (slot: number) => void;
}

const SaveSlots: FunctionComponent<Props> = ({
    saves,
    onClick,
    deleteSave
}) => {
    return (
        <div css={styles.saveSlots}>
            {saves.map((save, i) => (
                <SaveSlot
                    key={i}
                    save={save}
                    onClick={getOnClick(save, i)}
                    deleteSave={getDeleteSave(i)}
                />
            ))}
        </div>
    );

    function getOnClick(save: Option<Save>, i: number): () => void {
        return () => onClick(i, save);
    }

    function getDeleteSave(i: number): () => void {
        return () => deleteSave(i);
    }
};
export default SaveSlots;

const styles = {
    saveSlots: css({
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflowY: 'auto',
        flexWrap: 'wrap',
        alignContent: 'center'
    })
};
