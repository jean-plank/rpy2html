import * as t from 'io-ts'

export const StyleType = t.strict({
    selected_color: t.string,
    disabledbtn_color: t.string,
    accent_color: t.string,
    muted_color: t.string,

    game_width: t.number,
    game_height: t.number,

    textbox_height: t.string,
    textbox_yalign: t.string,

    namebox_bgtile: t.string,
    namebox_padding: t.string,
    namebox_ffamily: t.string,
    namebox_fsize_v: t.number,
    namebox_fsize_h: t.number,
    namebox_width: t.string,
    namebox_height: t.string,
    namebox_left: t.string,
    namebox_top: t.string,
    namebox_txtalign: t.string,

    dialog_color: t.string,
    dialog_ffamily: t.string,
    dialog_fsize_v: t.number,
    dialog_fsize_h: t.number,
    dialog_left: t.string,
    dialog_top: t.string,
    dialog_txtalign: t.string,
    dialog_width: t.string,

    mmenu_ffamily: t.string,
    mmenu_fsize_v: t.number,
    mmenu_fsize_h: t.number,

    mmenuitems_width: t.string,

    submenu_width: t.string,

    guibtn_padding: t.string,
    guibtn_color_hover: t.string,
    guibtn_color: t.string,
    guibtn_ffamily: t.string,
    guibtn_fsize_v: t.number,
    guibtn_fsize_h: t.number,
    guibtn_width: t.string,
    guibtn_height: t.string,
    guibtn_txtalign: t.string,
    quickbtn_fsize_v: t.number,
    quickbtn_fsize_h: t.number,

    choice_height: t.string,
    choice_yalign: t.string,

    choicebtn_bgtile: t.string,
    choicebtn_padding: t.string,
    choicebtn_color_hover: t.string,
    choicebtn_color: t.string,
    choicebtn_ffamily: t.string,
    choicebtn_fsize_v: t.number,
    choicebtn_fsize_h: t.number,
    choicebtn_txtalign: t.string,
    choicebtn_width: t.string,

    slot_width: t.string,
    slot_height: t.string,
    slot_padding: t.string,
    slot_fsize_v: t.number,
    slot_fsize_h: t.number,
    slot_txtalign: t.string,
    slot_color: t.string,
    thumb_width: t.string,
    thumb_height: t.string,
    thumb_margin_top: t.string,
    thumb_width_scale: t.number,
    thumb_height_scale: t.number,

    confirmframe_padding: t.string,

    interface_text_color: t.string,

    title_fsize_v: t.number,
    title_fsize_h: t.number
})

type Style = t.TypeOf<typeof StyleType>
export default Style
