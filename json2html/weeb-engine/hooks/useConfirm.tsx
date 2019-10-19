/** @jsx jsx */
import { jsx } from '@emotion/core'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import { RefObject, useRef, useState } from 'react'

import { KeyUpAble } from '../components/App'
import Confirm, { ConfirmProps } from '../components/Confirm'
import { transl } from '../context'

interface ConfirmHook {
    confirm: JSX.Element | null
    confirmAudio: (okAction: () => void) => void
    confirmYesNo: (
        message: string,
        actionYes: () => void,
        actionNo?: () => void
    ) => void
}

const useConfirm = (confirmKeyUpAble: RefObject<KeyUpAble>): ConfirmHook => {
    const confirmAudioShown = useRef(false)

    const [confirmProps, setConfirmProps] = useState<O.Option<ConfirmProps>>(
        O.none
    )

    const confirm = pipe(
        confirmProps,
        O.map(getConfirm),
        O.toNullable
    )

    function getConfirm(iConfirm: ConfirmProps): JSX.Element {
        return <Confirm ref={confirmKeyUpAble} {...iConfirm} />
    }

    const hideConfirm = () => setConfirmProps(O.none)

    const confirmAudio = (okAction: () => void) => {
        if (!confirmAudioShown.current) {
            confirmAudioShown.current = true
            setConfirmProps(
                O.some({
                    hideConfirm,
                    message: transl.confirm.audio,
                    buttons: [
                        { text: transl.confirm.audioBtn, onClick: okAction }
                    ],
                    escapeAction: okAction
                })
            )
        }
    }

    const confirmYesNo = (
        message: string,
        actionYes: () => void,
        actionNo?: () => void
    ) =>
        setConfirmProps(
            O.some({
                hideConfirm,
                message,
                buttons: [
                    { text: transl.confirm.yes, onClick: actionYes },
                    { text: transl.confirm.no, onClick: actionNo }
                ],
                escapeAction: actionNo
            })
        )

    return { confirm, confirmAudio, confirmYesNo }
}
export default useConfirm
