import { transl } from '../../../context';

type GameMenuBtn =
    | 'NONE'
    | 'RESUME'
    | 'HISTORY'
    | 'SAVE'
    | 'LOAD'
    | 'PREFS'
    | 'MAIN_MENU'
    | 'HELP';
export default GameMenuBtn;

export const gameMenuBtnLabel = (btn: GameMenuBtn): string => {
    if (btn === 'RESUME') return transl.menu.resume;
    if (btn === 'HISTORY') return transl.menu.history;
    if (btn === 'SAVE') return transl.menu.save;
    if (btn === 'LOAD') return transl.menu.load;
    if (btn === 'PREFS') return transl.menu.prefs;
    if (btn === 'MAIN_MENU') return transl.menu.mainMenu;
    if (btn === 'HELP') return transl.menu.help;
    return '';
};
