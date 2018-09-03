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
