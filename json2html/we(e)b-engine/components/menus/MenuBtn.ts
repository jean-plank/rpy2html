import { transl } from '../../context'

type MenuBtn =
    | 'START'
    | 'RESUME'
    | 'HISTORY'
    | 'SAVE'
    | 'LOAD'
    | 'PREFS'
    | 'MAIN_MENU'
    | 'MEMORY'
    | 'HELP'
export default MenuBtn

export const menuBtnLabel = (btn: MenuBtn): string => {
    switch (btn) {
        case 'START':
            return transl.menu.start
        case 'RESUME':
            return transl.menu.resume
        case 'HISTORY':
            return transl.menu.history
        case 'SAVE':
            return transl.menu.save
        case 'LOAD':
            return transl.menu.load
        case 'PREFS':
            return transl.menu.prefs
        case 'MAIN_MENU':
            return transl.menu.mainMenu
        case 'MEMORY':
            return transl.menu.memory
        case 'HELP':
            return transl.menu.help
    }
}
