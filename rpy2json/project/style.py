def parse(gui, config, fonts_usages, Borders):
    """
    Parse styles.
    """

    try:
        return new_style(gui, config, fonts_usages, Borders)
    except AttributeError as e:
        print
        print('[ERROR] %s' % e)
        print('You should define the concerned gui attribute.')
        print
        print('[INFO] falling back to default look')
        return old_style(gui, config, fonts_usages, Borders)


###
### new style
###
def new_style(gui, config, fonts_usages, Borders):
    res = {}

    res["selected_color"] = gui.selected_color
    res["disabledbtn_color"] = gui.insensitive_color
    res["accent_color"] = gui.accent_color

    # game
    HEIGHT = config.screen_height
    WIDTH = config.screen_width
    res["game_height"] = HEIGHT
    res["game_width"] = WIDTH

    # textbox
    res["textbox_height"] = percent(gui.textbox_height, HEIGHT)
    res["textbox_yalign"] = yalign(gui.textbox_yalign, gui.textbox_height, HEIGHT)

    # namebox
    namebox_fsize = fontsize(HEIGHT, WIDTH, gui.name_text_size)
    res["namebox_bgtile"] = bgtile(gui.namebox_tile)
    res["namebox_padding"] = padding(gui.namebox_borders, WIDTH)
    res["namebox_ffamily"] = fonts_usages["namebox"]
    res["namebox_fsize_v"] = namebox_fsize["v"]
    res["namebox_fsize_h"] = namebox_fsize["h"]
    res["namebox_width"] = get_or_else(percent(gui.namebox_width, WIDTH), "auto")
    res["namebox_height"] = get_or_else(percent(gui.namebox_height, gui.textbox_height), "auto")
    res["namebox_left"] = percent(gui.name_xpos, WIDTH)
    res["namebox_top"] = get_or_else(percent(gui.name_ypos + 5, gui.textbox_height), percent(5, gui.textbox_height))
    res["namebox_txtalign"] = textalign(gui.name_xalign)

    # dialog
    dialog_fsize = fontsize(HEIGHT, WIDTH, gui.text_size)
    res["dialog_color"] = gui.text_color
    res["dialog_ffamily"] = fonts_usages["dialog"]
    res["dialog_fsize_v"] = dialog_fsize["v"]
    res["dialog_fsize_h"] = dialog_fsize["h"]
    res["dialog_left"] = percent(gui.dialogue_xpos, WIDTH)
    res["dialog_top"] = percent(gui.dialogue_ypos + 5, gui.textbox_height)
    res["dialog_txtalign"] = textalign(gui.dialogue_text_xalign)
    res["dialog_width"] = percent(gui.dialogue_width, WIDTH)

    # main menu
    mmenu_fsize = fontsize(HEIGHT, WIDTH, gui.interface_text_size)
    res["mmenu_ffamily"] = fonts_usages["mmenu"]
    res["mmenu_fsize_v"] = mmenu_fsize["v"]
    res["mmenu_fsize_h"] = mmenu_fsize["h"]

    # main menu items
    mmenuitems_width = round(420.0 * WIDTH / 1920)
    res["mmenuitems_width"] = percent(mmenuitems_width, WIDTH)

    # submenu
    res["submenu_width"] = percent(WIDTH - mmenuitems_width, WIDTH)

    # gui button
    guibtn_fsize = fontsize(HEIGHT, WIDTH, gui.button_text_size)
    quickbtn_fsize = fontsize(HEIGHT, WIDTH, gui.quick_button_text_size)
    res["guibtn_padding"] = padding(guibtn_borders(gui, Borders), mmenuitems_width)
    res["guibtn_color_hover"] = gui.button_text_hover_color
    res["guibtn_color"] = gui.button_text_idle_color
    res["guibtn_ffamily"] = fonts_usages["guibtn"]
    res["guibtn_fsize_v"] = guibtn_fsize["v"]
    res["guibtn_fsize_h"] = guibtn_fsize["h"]
    res["guibtn_width"] = get_or_else(percent(gui.button_width, mmenuitems_width), "auto")
    res["guibtn_height"] = get_or_else(percent(gui.button_height, HEIGHT), "auto")
    res["guibtn_txtalign"] = textalign(gui.button_text_xalign)
    res["quickbtn_fsize_v"] = quickbtn_fsize["v"]
    res["quickbtn_fsize_h"] = quickbtn_fsize["h"]

    # choice
    res["choice_height"] = percent(HEIGHT - gui.textbox_height, HEIGHT)
    res["choice_yalign"] = yalign(1.0 - gui.textbox_yalign, HEIGHT - gui.textbox_height, HEIGHT)

    # choice button
    menubtn_fsize = fontsize(HEIGHT, WIDTH, gui.choice_button_text_size)
    res["choicebtn_bgtile"] = bgtile(gui.choice_button_tile)
    res["choicebtn_padding"] = padding(choicebtn_borders(gui, Borders), WIDTH)
    res["choicebtn_color_hover"] = gui.choice_button_text_hover_color
    res["choicebtn_color"] = gui.choice_button_text_idle_color
    res["choicebtn_ffamily"] = fonts_usages["choicebtn"]
    res["choicebtn_fsize_v"] = menubtn_fsize["v"]
    res["choicebtn_fsize_h"] = menubtn_fsize["h"]
    res["choicebtn_txtalign"] = textalign(gui.choice_button_text_xalign)
    res["choicebtn_width"] = get_or_else(percent(gui.choice_button_width, WIDTH), "auto")

    # save slots
    slot_fsize = fontsize(HEIGHT, WIDTH, gui.slot_button_text_size)
    res["slot_width"] = percent(gui.slot_button_width, WIDTH - mmenuitems_width)
    res["slot_height"] = percent(gui.slot_button_height, HEIGHT)
    res["slot_padding"] = padding(gui.slot_button_borders, WIDTH - mmenuitems_width)
    res["slot_fsize_v"] = slot_fsize["v"]
    res["slot_fsize_h"] = slot_fsize["h"]
    res["slot_txtalign"] = textalign(gui.slot_button_text_xalign)
    res["slot_color"] = gui.slot_button_text_idle_color
    res["thumb_width"] = percent(config.thumbnail_width, gui.slot_button_width)
    res["thumb_height"] = percent(config.thumbnail_height, gui.slot_button_height)
    res["thumb_margin_top"] = percent(gui.slot_button_borders.top * 2, HEIGHT - config.thumbnail_height)
    res["thumb_width_scale"] = float(config.thumbnail_width) / WIDTH
    res["thumb_height_scale"] = float(config.thumbnail_height) / HEIGHT

    # confirm frame
    res["confirmframe_padding"] = padding(gui.confirm_frame_borders, WIDTH)

    # interface color
    res["interface_text_color"] = gui.interface_text_color

    return res


def guibtn_borders(gui, Borders):
    left = gui.button_borders.left + 39
    top = gui.button_borders.top + 6
    right = gui.button_borders.right + 39
    bottom = gui.button_borders.bottom + 6
    return Borders(left, top, right, bottom)


def choicebtn_borders(gui, Borders):
    left = gui.choice_button_borders.left
    top = gui.choice_button_borders.top + 2
    right = gui.choice_button_borders.right
    bottom = gui.choice_button_borders.bottom + 2
    return Borders(left, top, right, bottom)


###
### old style
###
def old_style(gui, config, fonts_usages, Borders):
    res = {}

    res["selected_color"] = "#ffffff"
    res["disabledbtn_color"] = "#666666"
    res["accent_color"] = "#0099cc"

    # game
    HEIGHT = config.screen_height
    WIDTH = config.screen_width
    res["game_height"] = HEIGHT
    res["game_width"] = WIDTH

    # textbox
    textbox_height = 150
    textbox_yalign = 1.0
    res["textbox_height"] = percent(textbox_height, HEIGHT)
    res["textbox_yalign"] = yalign(textbox_yalign, textbox_height, HEIGHT)

    # namebox
    namebox_fsize = fontsize(HEIGHT, WIDTH, 32)
    res["namebox_bgtile"] = bgtile(False)
    res["namebox_padding"] = padding(Borders(5, 5, 5, 5), WIDTH)
    res["namebox_ffamily"] = fonts_usages["namebox"]
    res["namebox_fsize_v"] = namebox_fsize["v"]
    res["namebox_fsize_h"] = namebox_fsize["h"]
    res["namebox_width"] = "auto"
    res["namebox_height"] = "auto"
    res["namebox_left"] = percent(6, WIDTH)
    res["namebox_top"] = percent(10, textbox_height)
    res["namebox_txtalign"] = "left"

    # dialog
    dialog_fsize = fontsize(HEIGHT, WIDTH, 32)
    res["dialog_color"] = "#ffffff"
    res["dialog_ffamily"] = fonts_usages["dialog"]
    res["dialog_fsize_v"] = dialog_fsize["v"]
    res["dialog_fsize_h"] = dialog_fsize["h"]
    res["dialog_left"] = percent(12, WIDTH)
    res["dialog_top"] = percent(45, textbox_height)
    res["dialog_txtalign"] = "left"
    res["dialog_width"] = "auto"

    # main menu
    mmenu_fsize = fontsize(HEIGHT, WIDTH, 32)
    res["mmenu_ffamily"] = fonts_usages["mmenu"]
    res["mmenu_fsize_v"] = mmenu_fsize["v"]
    res["mmenu_fsize_h"] = mmenu_fsize["h"]

    # main menu items
    mmenuitems_width = round(420.0 * WIDTH / 1920)
    res["mmenuitems_width"] = percent(mmenuitems_width, WIDTH)

    # submenu
    submenu_width = WIDTH - mmenuitems_width
    res["submenu_width"] = percent(submenu_width, WIDTH)

    # gui button
    guibtn_fsize = fontsize(HEIGHT, WIDTH, 32)
    quickbtn_fsize = fontsize(HEIGHT, WIDTH, 21)
    res["guibtn_padding"] = padding(Borders(45, 12, 45, 12), mmenuitems_width)
    res["guibtn_color_hover"] = "#66c1e0" # "#b99d83"
    res["guibtn_color"] = "#888888" #b99d83"
    res["guibtn_ffamily"] = fonts_usages["guibtn"]
    res["guibtn_fsize_v"] = guibtn_fsize["v"]
    res["guibtn_fsize_h"] = guibtn_fsize["h"]
    res["guibtn_width"] = "auto"
    res["guibtn_height"] = "auto"
    res["guibtn_txtalign"] = "left"
    res["quickbtn_fsize_v"] = quickbtn_fsize["v"]
    res["quickbtn_fsize_h"] = quickbtn_fsize["h"]

    # choice
    res["choice_height"] = percent(HEIGHT - textbox_height, HEIGHT)
    res["choice_yalign"] = yalign(1.0 - textbox_yalign, HEIGHT - textbox_height, HEIGHT)

    # choice button
    menubtn_fsize = fontsize(HEIGHT, WIDTH, 33)
    res["choicebtn_bgtile"] = bgtile(False)
    res["choicebtn_padding"] = padding(Borders(150, 10, 150, 10), WIDTH)
    res["choicebtn_color_hover"] = "#ffffff"
    res["choicebtn_color"] = "#cccccc" # "#b99d83"
    res["choicebtn_ffamily"] = fonts_usages["choicebtn"]
    res["choicebtn_fsize_v"] = menubtn_fsize["v"]
    res["choicebtn_fsize_h"] = menubtn_fsize["h"]
    res["choicebtn_txtalign"] = "center"
    res["choicebtn_width"] = "auto"

    # save slots
    slot_button_width = 0.9 * submenu_width / 3.0
    slot_button_height = slot_button_width * HEIGHT / WIDTH
    slot_fsize = fontsize(HEIGHT, WIDTH, 21)
    res["slot_width"] = percent(slot_button_width, WIDTH - mmenuitems_width)
    res["slot_height"] = percent(slot_button_height, HEIGHT)
    res["slot_padding"] = padding(Borders(15, 15, 15, 15), WIDTH - mmenuitems_width)
    res["slot_fsize_v"] = slot_fsize["v"]
    res["slot_fsize_h"] = slot_fsize["h"]
    res["slot_txtalign"] = "center"
    res["slot_color"] = "#aaaaaa"
    res["thumb_width"] = "100%"
    res["thumb_height"] = "100%"
    res["thumb_margin_top"] = "0"
    res["thumb_width_scale"] = slot_button_width / WIDTH
    res["thumb_height_scale"] = slot_button_height / HEIGHT

    # confirm frame
    res["confirmframe_padding"] = padding(Borders(60, 60, 60, 60), WIDTH)

    # interface color
    res["interface_text_color"] = "#ffffff"

    return res


###
### utils
###
def percent(self_px, parent_px):
    if self_px != None:
        return str(round(100.0 * self_px / parent_px, 5))+"%"


def yalign(y, self_height, parent_height):
    if y == 0.0:
        return "top: 0"
    # elif y == 0.5:
    #     top = float(parent_height) - self_height / 2
    #     return "top: %s" % percent(top, parent_height)
    else:
        return "bottom: 0"


def bgtile(tile):
    if tile:
        return "background-repeat: repeat"
    else:
        return "background-size: 100% 100%"


def get_or_else(val, default):
    return val if val else default


def padding(borders, parent_w):
    # margin in percentage is relative to the width of the containing block
    return " ".join([
        percent(borders.top, parent_w),
        percent(borders.right, parent_w),
        percent(borders.bottom, parent_w),
        percent(borders.left, parent_w)
    ])


def textalign(x):
    if x == 1.0:
        return "right"
    elif x == 0.5:
        return "center"
    else:
        return "left"



def fontsize(HEIGHT, WIDTH, fsize):
    h = 3.11 * fsize / 33 # vh: 33 fsize => 3.11vh
    v = h * HEIGHT / WIDTH # vw
    return { "h": round(h, 5),  # vh
             "v": round(v, 5) } # vw
