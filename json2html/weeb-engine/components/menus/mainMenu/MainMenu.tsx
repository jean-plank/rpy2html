/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import * as R from 'fp-ts/lib/Record'
import {
    createRef,
    forwardRef,
    RefForwardingComponent,
    RefObject,
    useImperativeHandle
} from 'react'

import { HistoryHook } from '../../../hooks/useHistory'
import { SavesHook } from '../../../hooks/useSaves'
import Obj from '../../../Obj'
import Save from '../../../saves/Save'
import SoundService from '../../../sound/SoundService'
import { getBgOrElse } from '../../../utils/styles'
import { KeyUpAble } from '../../App'
import Help from '../Help'
import Menu, { MenuAble, MenuOverlay } from '../Menu'
import MenuBtn from '../MenuBtn'
import Preferences from '../Preferences'
import SaveSlots from '../SaveSlots'
import Memory from './Memory'

interface Props {
    soundService: SoundService
    startGame: () => void
    savesHook: SavesHook
    historyHook: HistoryHook
    confirmYesNo: (
        message: string,
        actionYes: () => void,
        actionNo?: () => void
    ) => void
}

const MainMenu: RefForwardingComponent<KeyUpAble, Props> = (
    {
        soundService,
        startGame,
        savesHook: { saves, emptySaves, deleteSave },
        historyHook: { loadSave },
        confirmYesNo
    },
    ref
) => {
    const menuAble: RefObject<MenuAble> = createRef()

    useImperativeHandle(ref, () => ({ onKeyUp }))

    return (
        <Menu
            ref={menuAble}
            overlay={MenuOverlay.MainMenu}
            buttons={[
                { btn: 'START', specialAction: O.some(startGame) },
                { btn: 'LOAD' },
                { btn: 'PREFS' },
                { btn: 'MEMORY' },
                { btn: 'HELP' }
            ]}
            submenu={submenu}
            styles={styles}
        />
    )

    function submenu(btn: MenuBtn): JSX.Element | null {
        if (btn === 'LOAD') return getLoad()
        if (btn === 'PREFS') return <Preferences soundService={soundService} />
        if (btn === 'MEMORY') return getMemory()
        if (btn === 'HELP') return <Help />
        return null
    }

    function getLoad(): JSX.Element {
        return (
            <SaveSlots
                saves={saves.slots}
                onClick={onClick}
                deleteSave={deleteSave}
                disabledIfEmpty={true}
            />
        )

        function onClick(_: number, save: O.Option<Save>) {
            pipe(
                save,
                O.map(loadSave)
            )
        }
    }

    function getMemory(): JSX.Element {
        return <Memory emptySaves={emptySaves} confirmYesNo={confirmYesNo} />
    }

    function onKeyUp(e: KeyboardEvent) {
        const keyEvents: Obj<(e: KeyboardEvent) => void> = {
            Escape: e => {
                pipe(
                    O.fromNullable(menuAble.current),
                    O.map(({ selectedBtn, setSelectedBtn, setOverlay }) => {
                        if (O.isSome(selectedBtn)) {
                            e.stopPropagation()
                            setSelectedBtn(O.none)
                            setOverlay(MenuOverlay.MainMenu)
                        }
                    })
                )
            }
        }
        pipe(
            R.lookup(e.key, keyEvents),
            O.map(_ => _(e))
        )
    }
}
export default forwardRef<KeyUpAble, Props>(MainMenu)

const styles = css({
    ...getBgOrElse('main_menu_bg', '#5f777f')
})
