import { css } from '@emotion/core';

import { style } from '../../context';
import { getBgOrElse, ifOldStyle, mediaQuery } from '../../utils/styles';

export const mainMenuOverlay = 'main-menu-overlay';
export const gameMenuOverlay = 'game-menu-overlay';

const menuStyles = {
    menu: css({
        display: 'flex',
        backgroundSize: '100% 100%',
        position: 'absolute',
        outline: 'none',
        height: '100%',
        width: '100%',
        fontFamily: style.mmenu_ffamily,
        fontSize: `${style.mmenu_fsize_h}vh`,
        [mediaQuery(style)]: {
            fontSize: `${style.mmenu_fsize_v}vw`
        },

        [`& .${mainMenuOverlay}, & .${gameMenuOverlay}`]: {
            position: 'absolute',
            height: '100%',
            width: '100%',
            backgroundSize: '100% 100%'
        },

        [`& .${mainMenuOverlay}`]: {
            ...getBgOrElse('main_menu_overlay')
        },

        [`& .${gameMenuOverlay}`]: {
            ...getBgOrElse('game_menu_overlay', 'rgba(19, 24, 25, 0.75)')
        }
    }),

    menuBar: css({
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        width: style.mmenuitems_width,
        ...ifOldStyle({
            backgroundColor: 'rgba(19, 24, 25, 0.75)'
        })
    }),

    submenuTitle: css({
        position: 'absolute',
        top: '1%',
        padding: '0.33em 0.67em',
        fontSize: `${style.title_fsize_h}vh`,
        color: style.accent_color,
        [mediaQuery(style)]: {
            fontSize: `${style.title_fsize_v}vw`
        }
    }),

    submenu: css({
        position: 'relative',
        height: '100%',
        width: style.submenu_width,
        fontFamily: style.guibtn_ffamily,
        fontSize: `${style.guibtn_fsize_h}vh`,
        [mediaQuery(style)]: {
            fontSize: `${style.guibtn_fsize_v}vw`
        }
    })
};
export default menuStyles;
