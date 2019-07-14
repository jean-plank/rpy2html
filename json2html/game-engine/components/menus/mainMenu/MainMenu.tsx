/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { fromNullable, none, Option, some } from 'fp-ts/lib/Option'
import { lookup, StrMap } from 'fp-ts/lib/StrMap'
import {
    createRef,
    forwardRef,
    RefForwardingComponent,
    RefObject,
    useImperativeHandle
} from 'react'

import QuickSave from '../../../saves/QuickSave'
import Save from '../../../saves/Save'
import SoundService from '../../../sound/SoundService'
import { getBgOrElse } from '../../../utils/styles'
import { KeyUpAble } from '../../App'
import Help from '../Help'
import Menu, { MenuAble, MenuBtn, MenuOverlay } from '../Menu'
import Preferences from '../Preferences'
import SaveSlots from '../SaveSlots'
import Memory from './Memory'

interface Props {
    soundService: SoundService
    startGame: () => void
    saves: Array<Option<Save>>
    emptySaves: () => void
    loadSave: (save: QuickSave) => void
    deleteSave: (slot: number) => void
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
        saves,
        emptySaves,
        loadSave,
        deleteSave,
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
                { btn: 'START', specialAction: some(startGame) },
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
                saves={saves}
                onClick={onClick}
                deleteSave={deleteSave}
            />
        )

        function onClick(_: number, save: Option<Save>) {
            save.map(loadSave)
        }
    }

    function getMemory(): JSX.Element {
        return <Memory emptySaves={emptySaves} confirmYesNo={confirmYesNo} />
    }

    function onKeyUp(e: React.KeyboardEvent) {
        const keyEvents = new StrMap<(e: React.KeyboardEvent) => void>({
            Escape: e => {
                fromNullable(menuAble.current).map(
                    ({ selectedBtn, setSelectedBtn, setOverlay }) => {
                        if (selectedBtn.isSome()) {
                            e.stopPropagation()
                            setSelectedBtn(none)
                            setOverlay(MenuOverlay.MainMenu)
                        }
                    }
                )
            }
        })
        lookup(e.key, keyEvents).map(_ => _(e))
    }
}
export default forwardRef<KeyUpAble, Props>(MainMenu)

const styles = css({
    ...getBgOrElse('main_menu_bg', '#5f777f')
})
