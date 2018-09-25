import * as _ from 'lodash';

import { Story, StoryDatas } from './classes/Story';
import { Font, Fonts } from './classes/Font';
import { Node } from './classes/nodes';


function getBgOrElse(urlBg: string, color?: string): string {
    if (urlBg != undefined) {
        return `background-color: none;
background-image: url("${urlBg}");`;
    } else if (color != undefined) {
        return `background-color: ${color};`;
    } else {
        return "";
    }
}

function getFonts(fonts: Fonts): string {
    return _.reduce(fonts,
        (acc: string, font: Font, name: string) => {
            if (name === "dejavusans_bold_ttf") {
                return `${acc}${font.face("dejavusans_ttf")}\n`;
            } else {
                return `${acc}${font.face(name)}\n`;
            }
        },
        "");
}

export function getStyle(datas: StoryDatas): string {
    const story = Story.getInstance();
    const fonts = getFonts(datas.fonts);

    return `#${story.$.textbox.attr("id")} {
    ${getBgOrElse(datas.textbox_bg)}
}

#${story.$.namebox.attr("id")} {
    ${getBgOrElse(datas.namebox_bg)}
}

${fonts}

#${story.$.mainMenu.attr("id")} {
    ${getBgOrElse(datas.main_menu_overlay)}
}

#${story.$.choice.attr("id")}>button {
    ${getBgOrElse(datas.choice_btn_bg)}
}

#${story.$.choice.attr("id")}>button:hover {
    ${getBgOrElse(datas.choice_btn_hover)}
}

#${story.$.confirm.attr("id")} {
    ${getBgOrElse(datas.confirm_overlay)}
}

.frame {
    ${getBgOrElse(datas.frame_bg, "black")};
}
`;
}


const word = /\W([a-zA-Z_]\w*)\W/g;
const kwords = [
    // "break", "case", "catch", "class", "const", "continue", "debugger", "default", "delete", "do", "else", "export", "extends", "finally", "for", "function", "if", "import", "in", "instanceof", "new", "return", "super", "switch", "this", "throw", "try", "typeof", "var", "void", "while", "with", "yield",
    // "null", "undefined",
    "true", "false",
];

export function convertToJs(code: string): string {
    const match = ` ${code} `.match(word);

    return _.reduce(match, (acc: string, m: string) => {
            const trimedM: string = m.trim();

            if (kwords.indexOf(trimedM) === -1) {
                return acc.replace(trimedM, `window.${trimedM}`);
            } else {
                return acc;
            }
        }, code)
        .replace("==", "===");
}
