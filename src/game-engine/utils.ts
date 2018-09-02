import { Story, StoryDatas } from './classes/Story';


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


export function getStyle(datas: StoryDatas, fonts: string): string {
    const story = Story.getInstance();

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
