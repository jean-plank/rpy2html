/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { FunctionComponent } from 'react'

import { lang, style, transl } from '../../../context'
import GuiButton from '../../GuiButton'

export interface Props {
    storageKey: string
    bytes: number
    deleteStorage: () => void
    deleteAll?: boolean
}

const MemoryGame: FunctionComponent<Props> = ({
    storageKey,
    bytes,
    deleteStorage,
    deleteAll = false
}) => {
    const strDel = deleteAll ? transl.memory.deleteAll : transl.memory.delete
    return (
        <div css={styles.memoryGame}>
            <div css={styles.key}>{storageKey}</div>
            <div css={styles.bytes}>
                {formatNumber(bytes, lang)} {transl.memory.bytes}
            </div>
            <GuiButton onClick={deleteStorage} css={styles.btn}>
                ✗ {strDel}
            </GuiButton>
        </div>
    )
}
export default MemoryGame

const formatNumber = (n: number, lang: string): string =>
    new Intl.NumberFormat(lang).format(n)

const styles = {
    memoryGame: css({
        width: '100%',
        padding: '0 3em',
        display: 'flex',
        alignItems: 'center'
    }),

    key: css({
        flexGrow: 1,
        color: style.accent_color,
        padding: '0.67em 0'
    }),

    bytes: css({
        justifyContent: 'right',
        padding: '0.67em 0',
        margin: '0 0.67em',
        flexShrink: 0
    }),

    btn: css({
        padding: '0.67em 0',
        flexShrink: 0
    })
}
