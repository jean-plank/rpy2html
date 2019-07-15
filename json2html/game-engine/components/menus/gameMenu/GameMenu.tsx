/** @jsx jsx */
import { jsx } from '@emotion/core'
import { fromNullable, none, Option, some } from 'fp-ts/lib/Option'
import { lookup, StrMap } from 'fp-ts/lib/StrMap'
import {
    createRef,
    forwardRef,
    RefForwardingComponent,
    RefObject,
    useImperativeHandle
} from 'react'

import { transl } from '../../../context'
import AstNode from '../../../nodes/AstNode'
import QuickSave from '../../../saves/QuickSave'
import Save from '../../../saves/Save'
import SoundService from '../../../sound/SoundService'
import { KeyUpAble } from '../../App'
import Help from '../Help'
import Menu, { MenuAble, MenuBtn, MenuOverlay } from '../Menu'
import Preferences from '../Preferences'
import SaveSlots from '../SaveSlots'
import History from './History'

interface Props {
    soundService: SoundService
    history: AstNode[]
    saves: Array<Option<Save>>
    loadSave: (save: QuickSave) => void
    deleteSave: (slot: number) => void
    hideGameMenu: () => void
    showMainMenu: () => void
    save: (slot: number) => void
    confirmYesNo: (
        msg: string,
        actionYes: () => void,
        actionNo?: () => void
    ) => void
    selectedBtn?: Option<MenuBtn>
}

const GameMenu: RefForwardingComponent<KeyUpAble, Props> = (
    {
        soundService,
        history,
        saves,
        loadSave,
        deleteSave,
        hideGameMenu,
        showMainMenu,
        save,
        confirmYesNo,
        selectedBtn = none
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
                { btn: 'RESUME', specialAction: some(hideGameMenu) },
                { btn: 'HISTORY' },
                { btn: 'SAVE' },
                { btn: 'LOAD' },
                { btn: 'PREFS' },
                { btn: 'MAIN_MENU', specialAction: some(confirmMainMenu) },
                { btn: 'HELP' }
            ]}
            submenu={submenu}
            selectedBtn={selectedBtn}
        />
    )

    function submenu(btn: MenuBtn): JSX.Element | null {
        if (btn === 'HISTORY') return <History nodes={history} />
        if (btn === 'SAVE') return getSave()
        if (btn === 'LOAD') return getLoad()
        if (btn === 'PREFS') return <Preferences soundService={soundService} />
        if (btn === 'HELP') return <Help />
        return null
    }

    function getSave(): JSX.Element {
        return (
            <SaveSlots
                saves={saves}
                onClick={onClick}
                deleteSave={deleteSave}
            />
        )

        function onClick(slot: number, existingSave: Option<Save>) {
            existingSave.foldL(
                () => save(slot),
                _ => confirmYesNo(transl.confirm.override, () => save(slot))
            )
        }
    }

    function getLoad(): JSX.Element {
        return (
            <SaveSlots
                saves={saves}
                onClick={onClick}
                deleteSave={deleteSave}
                disabledIfEmpty={true}
            />
        )

        function onClick(_: number, save: Option<Save>) {
            save.map(_ =>
                confirmYesNo(transl.confirm.unsaved, () => save.map(loadSave))
            )
        }
    }

    function confirmMainMenu() {
        fromNullable(menuAble.current).map(({ setSelectedBtn }) => {
            setSelectedBtn(some('MAIN_MENU'))
            confirmYesNo(transl.confirm.unsaved, showMainMenu, () =>
                setSelectedBtn(none)
            )
        })
    }

    function onKeyUp(e: React.KeyboardEvent) {
        const keyEvents: StrMap<(e: React.KeyboardEvent) => void> = new StrMap({
            Escape: e => {
                e.stopPropagation()
                hideGameMenu()
            }
        })
        lookup(e.key, keyEvents).map(_ => _(e))
    }
}
export default forwardRef<KeyUpAble, Props>(GameMenu)
