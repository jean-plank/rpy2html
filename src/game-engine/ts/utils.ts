import * as _ from 'lodash';
import * as $ from "jquery";

import { Story, StoryDatas } from './classes/Story';
import { Font, Fonts } from './classes/Font';


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

#${story.$.choice.attr("id")}>button {
    ${getBgOrElse(datas.choice_btn_bg)}
}

#${story.$.choice.attr("id")}>button:hover {
    ${getBgOrElse(datas.choice_btn_hover)}
}

#${story.$.confirm.attr("id")} {
    ${getBgOrElse(datas.confirm_overlay)}
}

.slot {
    ${getBgOrElse(datas.slot_bg)}
}

.slot:hover {
    ${getBgOrElse(datas.slot_hover)}
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


type Actions = {
    [id: string]: () => void;
}

export function actionBtn(event: any, actions: Actions): boolean {
    const $btn: JQuery<HTMLElement> = $(event.target).closest("button");

    if ($btn.length !== 0) {
        const id: string = $btn.attr("name");

        if (_.has(actions, id)) {
            actions[id]();
            return true;
        }
    }
    return false;
}


export function actionKey(event: any, actions: Actions): void {
    if (_.has(actions, event.which)) {
        actions[event.which]();
    }
}


type Save = {
    img: string;
    date: string;
}

function isValidSave(save: any): boolean {
    return save === null || (  _.keys(save).length === 2
                            && _.has(save, "img")
                            && _.has(save, "date"));
}

const nbSlots: number = 6;
const jpSaves: string = "jpSaves";

/**
 * Retrieves localStorage[jpSaves] and checks.
 * @returns {Save[]} of length nbSlots containing valids Save
 * (Save can be null).
 * Won't return more than slots saves (even if there are more)
 */
export function existingSaves(): Save[] {
    const tmp: string = localStorage.getItem(jpSaves);
    let res: Save[];
    if (tmp === undefined) {
        res = _.times(nbSlots, _.constant(null));
    } else {
        const anySaves: any = JSON.parse(tmp);
        if (_.isArray(anySaves)) {
            res = _.map(<any[]>anySaves, (save) => {
                if (isValidSave(save)) return <Save>save;
                else return null;
            });
        } else {
            res = _.times(nbSlots, _.constant(null));
        }
    }
    console.log('existingSaves() =', res);
    return res;
}

export function storeSave(save: Save, iSlot: number): void {
    const saves: Save[] = existingSaves();
    const res: Save[] = _.map(_.range(nbSlots), (i) => {
        if (i === iSlot) {
            return save;
        } else {
            return saves[i];
        }
    });
    console.log(`storeSave(${save}, ${iSlot}) =`, res);
    localStorage.setItem(jpSaves, JSON.stringify(res));
}
