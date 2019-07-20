/** @jsx jsx */
import { jsx } from '@emotion/core'
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

import { transl } from '../../../context'
import { HistoryHook } from '../../../hooks/useHistory'
import { SavesHook } from '../../../hooks/useSaves'
import Obj from '../../../Obj'
import Save from '../../../saves/Save'
import SoundService from '../../../sound/SoundService'
import { KeyUpAble } from '../../App'
import Help from '../Help'
import Menu, { MenuAble, MenuOverlay } from '../Menu'
import MenuBtn from '../MenuBtn'
import Preferences from '../Preferences'
import SaveSlots from '../SaveSlots'
import History from './History'

interface Props {
    soundService: SoundService
    hideGameMenu: () => void
    showMainMenu: () => void
    savesHook: SavesHook
    historyHook: HistoryHook
    confirmYesNo: (
        msg: string,
        actionYes: () => void,
        actionNo?: () => void
    ) => void
    selectedBtn?: O.Option<MenuBtn>
}

const GameMenu: RefForwardingComponent<KeyUpAble, Props> = (
    {
        soundService,
        hideGameMenu,
        savesHook: { saves, deleteSave, save },
        historyHook: { historyFromState, loadSave },
        showMainMenu,
        confirmYesNo,
        selectedBtn = O.none
    },
    ref
) => {
    const menuAble: RefObject<MenuAble> = createRef()

    useImperativeHandle(ref, () => ({ onKeyUp }))

    return (
        <Menu
            ref={menuAble}
            overlay={MenuOverlay.GameMenu}
            buttons={[
                { btn: 'HISTORY' },
                { btn: 'SAVE' },
                { btn: 'LOAD' },
                { btn: 'PREFS' },
                { btn: 'MAIN_MENU', specialAction: O.some(confirmMainMenu) },
                { btn: 'HELP' }
            ]}
            returnAction={hideGameMenu}
            submenu={submenu}
            selectedBtn={selectedBtn}
        />
    )

    function submenu(btn: MenuBtn): JSX.Element | null {
        if (btn === 'HISTORY') return <History nodes={historyFromState()} />
        if (btn === 'SAVE') return getSave()
        if (btn === 'LOAD') return getLoad()
        if (btn === 'PREFS') return <Preferences soundService={soundService} />
        if (btn === 'HELP') return <Help />
        return null
    }

    function getSave(): JSX.Element {
        return (
            <SaveSlots
                saves={saves.slots}
                onClick={onClick}
                deleteSave={deleteSave}
            />
        )

        function onClick(slot: number, existingSave: O.Option<Save>) {
            pipe(
                existingSave,
                O.fold(
                    () => save(slot),
                    _ => confirmYesNo(transl.confirm.override, () => save(slot))
                )
            )
        }
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
                O.map(_ =>
                    confirmYesNo(transl.confirm.unsaved, () =>
                        pipe(
                            save,
                            O.map(loadSave)
                        )
                    )
                )
            )
        }
    }

    function confirmMainMenu() {
        pipe(
            O.fromNullable(menuAble.current),
            O.map(({ setSelectedBtn }) => {
                setSelectedBtn(O.some('MAIN_MENU'))
                confirmYesNo(transl.confirm.unsaved, showMainMenu, () =>
                    setSelectedBtn(O.none)
                )
            })
        )
    }

    function onKeyUp(e: KeyboardEvent) {
        const keyEvents: Obj<(e: KeyboardEvent) => void> = {
            Escape: e => {
                e.stopPropagation()
                hideGameMenu()
            }
        }
        pipe(
            R.lookup(e.key, keyEvents),
            O.map(_ => _(e))
        )
    }
}
export default forwardRef<KeyUpAble, Props>(GameMenu)
