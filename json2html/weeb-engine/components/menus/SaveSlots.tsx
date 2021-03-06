/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import * as O from 'fp-ts/lib/Option'
import { FunctionComponent } from 'react'

import Save from '../../saves/Save'
import SaveSlot from './SaveSlot'

interface Props {
    saves: O.Option<Save>[]
    onClick: (slot: number, save: O.Option<Save>) => void
    deleteSave: (slot: number) => void
    disabledIfEmpty?: boolean
}

const SaveSlots: FunctionComponent<Props> = ({
    saves,
    onClick,
    deleteSave,
    disabledIfEmpty
}) => {
    return (
        <div css={styles.saveSlots}>
            {saves.map((save, i) => (
                <SaveSlot
                    key={i}
                    save={save}
                    onClick={getOnClick(save, i)}
                    deleteSave={getDeleteSave(i)}
                    disabledIfEmpty={disabledIfEmpty}
                />
            ))}
        </div>
    )

    function getOnClick(save: O.Option<Save>, i: number): () => void {
        return () => onClick(i, save)
    }

    function getDeleteSave(i: number): () => void {
        return () => deleteSave(i)
    }
}
export default SaveSlots

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
}
