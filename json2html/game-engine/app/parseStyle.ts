/* tslint:disable:max-line-length */
import { fromNullable } from 'fp-ts/lib/Option';
import { lookup, StrMap, toArray } from 'fp-ts/lib/StrMap';

import * as confirmStyles from '../components/__style/Confirm.css';
import * as notificationsStyles from '../components/__style/Notifications.css';
import * as armlessWankerMenuStyles from '../components/game/__style/ArmlessWankerMenu.css';
import * as choicesStyles from '../components/game/__style/Choices.css';
import * as gameStyles from '../components/game/__style/Game.css';
import * as textBoxStyles from '../components/game/__style/Textbox.css';
import * as helpStyles from '../components/menus/__style/Help.css';
import * as menuButtonStyles from '../components/menus/__style/MenuButton.css';
import * as menuStyles from '../components/menus/__style/menus.css';
import * as saveSlotStyles from '../components/menus/__style/SaveSlot.css';
import * as gameMenuStyles from '../components/menus/gameMenu/__style/GameMenu.css';
import * as mainMenuStyles from '../components/menus/mainMenu/__style/MainMenu.css';
import * as memoryStyles from '../components/menus/mainMenu/__style/Memory.css';
import * as memoryGameStyles from '../components/menus/mainMenu/__style/MemoryGame.css';
import * as appStyles from './__style/App.css';

import { Style } from '../../renpy-json-loader/RenpyJson';
import Font from '../models/Font';
import Image from '../models/medias/Image';

const parseStyle = (
    style: Style,
    fonts: StrMap<Font>,
    images: StrMap<Image>
): HTMLStyleElement => {
    const newStyleIsSome = lookup('main_menu_overlay', images).isSome();
    const ifNewStyle = (style: string): string => (newStyleIsSome ? style : '');

    const slotBgIsNone = lookup('slot_bg', images).isNone();
    const ifNoSlotBg = (style: string): string => (slotBgIsNone ? style : '');

    const res = document.createElement('style');
    res.innerHTML = `${getFonts(fonts)}

.${mainMenuStyles.mainMenu},
.${gameStyles.game},
.${gameMenuStyles.gameMenu},
.${confirmStyles.confirm} {
    width: ${(100 * style.game_width) / style.game_height}vh;
}

.${menuStyles.menu},
.${confirmStyles.confirm} {
    font-family: ${style.mmenu_ffamily};
    font-size: ${style.mmenu_fsize_h}vh;
}

.${textBoxStyles.textbox} {
    height: ${style.textbox_height};
    ${style.textbox_yalign}; /* top: 0; or bottom: 0; */
    ${getBgOrElse(images, 'textbox_bg', 'rgba(0,0,0,0.75)')}
}

.${textBoxStyles.namebox} {
    top: ${style.namebox_top};
    left: ${style.namebox_left};
    right: ${style.namebox_left};
    font-family: ${style.namebox_ffamily};
    font-size: ${style.namebox_fsize_h}vh;
    width: ${style.namebox_width};
    height: ${style.namebox_height};
    padding: ${style.namebox_padding};
    text-align: ${style.namebox_txtalign};
    ${getBgOrElse(images, 'namebox_bg')}
    ${style.namebox_bgtile};
}

.${saveSlotStyles.saveSlot} .${textBoxStyles.namebox} {
    font-size: ${style.namebox_fsize_h * style.thumb_height_scale}vh;
}

.${textBoxStyles.dialog} {
    top: ${style.dialog_top};
    left: ${style.dialog_left};
    font-family: ${style.dialog_ffamily};
    font-size: ${style.dialog_fsize_h}vh;
    color: ${style.dialog_color};
    width: ${style.dialog_width};
    text-align: ${style.dialog_txtalign};
}

.${saveSlotStyles.saveSlot} .${textBoxStyles.dialog} {
    font-size: ${style.dialog_fsize_h * style.thumb_height_scale}vh;
}

.${mainMenuStyles.mainMenu} {
    ${getBgOrElse(images, 'main_menu_bg', '#5f777f')}
}

.${menuStyles.mainMenuOverlay} {
    ${getBgOrElse(images, 'main_menu_overlay')}
}

.${menuStyles.gameMenuOverlay} {
    ${getBgOrElse(images, 'game_menu_overlay', 'rgba(19, 24, 25, 0.75)')}
}

.${menuStyles.submenuTitle} {
    font-size: ${style.title_fsize_h}vh;
}

.${menuStyles.menuBar} {
    width: ${style.mmenuitems_width};${ifNewStyle(`
    background-color: rgba(19, 24, 25, 0.75);`)}
}

.${menuStyles.submenu} {
    width: ${style.submenu_width};
}

.${notificationsStyles.notifications},
.${menuButtonStyles.menuButton},
.${menuStyles.submenu} {
    font-family: ${style.guibtn_ffamily};
    font-size: ${style.guibtn_fsize_h}vh;
}

.${armlessWankerMenuStyles.menuButton} {
    font-size: ${style.quickbtn_fsize_h}vh;
}

.${memoryStyles.about} {
    border-color: ${style.interface_text_color};
}

.${menuButtonStyles.menuButton} {
    color: ${style.guibtn_color};
    width: ${style.guibtn_width};
    text-align: ${style.guibtn_txtalign};
}

.${menuStyles.menu} .${menuButtonStyles.menuButton} {
    padding: ${style.guibtn_padding};
    height: ${style.guibtn_height};
}

.${menuButtonStyles.menuButton}:hover {
    color: ${style.guibtn_color_hover};
}

.${menuButtonStyles.selected},
.${menuButtonStyles.selected}:hover {
    color: ${style.selected_color};
}

.${menuButtonStyles.menuButton}:disabled,
.${choicesStyles.choice}:disabled {
    color: ${style.disabledbtn_color};
}

.${menuStyles.submenuTitle},
.${helpStyles.help} td:first-child,
.${memoryGameStyles.key} {
    color: ${style.accent_color};
}

.${choicesStyles.choices} {
    height: ${style.choice_height};
    ${style.choice_yalign};
}

.${choicesStyles.choice} {
    color: ${style.choicebtn_color};
    width: ${style.choicebtn_width};
    padding: ${style.choicebtn_padding};
    font-family: ${style.choicebtn_ffamily};
    font-size: ${style.choicebtn_fsize_h}vh;
    text-align: ${style.choicebtn_txtalign};
    ${getBgOrElse(images, 'choice_btn_bg', 'rgba(0, 0, 0, 0.75)')}
    ${style.choicebtn_bgtile};
}

.${saveSlotStyles.saveSlot} .${choicesStyles.choice} {
    font-size: ${style.choicebtn_fsize_h * style.thumb_height_scale}vh;
}

.${choicesStyles.choice}:hover {
    color: ${style.choicebtn_color_hover};
    ${getBgOrElse(images, 'choice_btn_hover', 'rgba(0, 153, 204, 0.75)')}
}

.${saveSlotStyles.saveSlot} {
    ${getBgOrElse(images, 'slot_bg')}
    color: ${style.slot_color};
    width: ${style.slot_width};
    height: ${style.slot_height};
    margin: ${style.slot_padding};
    font-size: ${style.slot_fsize_h}vh;
    text-align: ${style.slot_txtalign};
}

.${saveSlotStyles.saveSlot}:hover {
    ${getBgOrElse(images, 'slot_hover')}
}

.${saveSlotStyles.saveSlot}>* {
    width: calc(${style.thumb_width} + 1px);
}

.${saveSlotStyles.game},
.${saveSlotStyles.emptySlot} {
    height: calc(${style.thumb_height} + 1px);
    margin-top: ${style.thumb_margin_top};${ifNoSlotBg(`
    background-color: #003d51;`)}
}${ifNoSlotBg(`

.${saveSlotStyles.saveSlot}:hover>.${saveSlotStyles.emptySlot} {
    background-color: #005b7a;
}`)}

.${confirmStyles.confirm} {
    ${getBgOrElse(images, 'confirm_overlay', 'rgba(19, 24, 25, 0.25)')}
}

.${confirmStyles.frame} {
    padding: ${style.confirmframe_padding};
    ${getBgOrElse(images, 'frame_bg', 'black')};${ifNewStyle(`
    border: 3px solid #0095c7;`)}
}

@media (max-aspect-ratio: ${style.game_width} / ${style.game_height}) {
    .${appStyles.container} {
        flex-direction: column;
    }

    .${mainMenuStyles.mainMenu},
    .${gameStyles.game},
    .${gameMenuStyles.gameMenu},
    .${confirmStyles.confirm} {
        width: 100vw;
        height: ${(100 * style.game_height) / style.game_width}vw;
    }

    .${menuStyles.menu},
    .${confirmStyles.confirm} {
        font-size: ${style.mmenu_fsize_v}vw;
    }

    .${textBoxStyles.namebox} {
        font-size: ${style.namebox_fsize_v}vw;
    }

    .${saveSlotStyles.saveSlot} .${textBoxStyles.namebox} {
        font-size: ${style.namebox_fsize_v * style.thumb_width_scale}vw;
    }

    .${textBoxStyles.dialog} {
        font-size: ${style.dialog_fsize_v}vw;
    }

    .${saveSlotStyles.saveSlot} .${textBoxStyles.dialog} {
        font-size: ${style.dialog_fsize_v * style.thumb_width_scale}vw;
    }

    .${choicesStyles.choice} {
        font-size: ${style.choicebtn_fsize_v}vw;
    }

    .${saveSlotStyles.saveSlot} .${choicesStyles.choice} {
        font-size: ${style.choicebtn_fsize_v * style.thumb_width_scale}vw;
    }

    .${menuStyles.submenuTitle} {
        font-size: ${style.title_fsize_v}vw;
    }

    .${notificationsStyles.notifications},
    .${menuButtonStyles.menuButton},
    .${menuStyles.submenu} {
        font-size: ${style.guibtn_fsize_v}vw;
    }

    .${armlessWankerMenuStyles.menuButton} {
        font-size: ${style.quickbtn_fsize_v}vw;
    }

    .${saveSlotStyles.saveSlot} {
        font-size: ${style.slot_fsize_v}vw;
    }
}`;
    return res;
};
export default parseStyle;

const getFonts = (fonts: StrMap<Font>): string => {
    return toArray(fonts).reduce((acc, [name, font]) => {
        if (name === 'dejavusans_bold_ttf') {
            return `${acc}${font.face('dejavusans_ttf')}\n`;
        } else {
            return `${acc}${font.face(name)}\n`;
        }
    }, '');
};

const getBgOrElse = (
    images: StrMap<Image>,
    img: string,
    color?: string
): string => {
    return lookup(img, images)
        .map(_ =>
            [
                'background-color: unset;',
                `background-image: url('${_.file}');`
            ].join('\n')
        )
        .getOrElseL(() => {
            console.warn(`Background image not found: ${img}`);
            return fromNullable(color)
                .map(_ => `background-color: ${_};`)
                .getOrElse('');
        });
};
