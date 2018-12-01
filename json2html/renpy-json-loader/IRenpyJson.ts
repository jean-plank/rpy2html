import IObj from '../game-engine/classes/IObj';


// TypeScript version of the validation jsons.
// If you add things below, don't forget to update the validation jsons.
export default interface IRenpyJson {
    game_name: string;
    lang: string;
    help: string;
    images: IObj<string>;
    sounds: IObj<string>;
    videos: IObj<string>;
    characters: IObj<IRawChar>;
    nodes: IObj<IRawNode>;
    fonts: IObj<IRawDefinition>;
    style: IStyle;
}

export interface IRawChar {
    color: string | null;
    name: string;
}

export interface IRawNode {
    class_name: string;
    arguments: Array<string | string[] | number | boolean | null>;
}

export interface IRawDefinition {
    src: string;
    bold: boolean;
}

export interface IStyle {
    selected_color: string;
    disabledbtn_color: string;
    accent_color: string;

    game_width: number;
    game_height: number;

    textbox_height: string;
    textbox_yalign: string;

    namebox_bgtile: string;
    namebox_padding: string;
    namebox_ffamily: string;
    namebox_fsize_v: number;
    namebox_fsize_h: number;
    namebox_width: string;
    namebox_height: string;
    namebox_left: string;
    namebox_top: string;
    namebox_txtalign: string;

    dialog_color: string;
    dialog_ffamily: string;
    dialog_fsize_v: number;
    dialog_fsize_h: number;
    dialog_left: string;
    dialog_top: string;
    dialog_txtalign: string;
    dialog_width: string;

    mmenu_ffamily: string;
    mmenu_fsize_v: number;
    mmenu_fsize_h: number;

    mmenuitems_width: string;

    submenu_width: string;

    guibtn_padding: string;
    guibtn_color_hover: string;
    guibtn_color: string;
    guibtn_ffamily: string;
    guibtn_fsize_v: number;
    guibtn_fsize_h: number;
    guibtn_width: string;
    guibtn_height: string;
    guibtn_txtalign: string;
    quickbtn_fsize_v: string;
    quickbtn_fsize_h: string;

    choice_height: string;
    choice_yalign: string;

    choicebtn_bgtile: string;
    choicebtn_padding: string;
    choicebtn_color_hover: string;
    choicebtn_color: string;
    choicebtn_ffamily: string;
    choicebtn_fsize_v: number;
    choicebtn_fsize_h: number;
    choicebtn_txtalign: string;
    choicebtn_width: string;

    slot_width: string;
    slot_height: string;
    slot_padding: string;
    slot_fsize_v: number;
    slot_fsize_h: number;
    slot_txtalign: string;
    slot_color: string;
    thumb_width: string;
    thumb_height: string;
    thumb_margin_top: string;
    thumb_width_scale: number;
    thumb_height_scale: number;

    confirmframe_padding: string;

    interface_text_color: string;
}
