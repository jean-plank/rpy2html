init python:
    from sys import argv
    from os import path, makedirs
    from string import Template
    import pygame
    import re

    config.debug_sound = False

    TEMPLATE_CSS = "template.css"

    TEMPLATE_OLD_CSS = "template-old.css"

    TEMPLATE_TS = "template.ts"

    OUTPUT_DIR = "src/converted"

    OUTPUT_CSS = "converted.css"

    OUTPUT_TS = "converted.ts"

    GAME_BASE_DIR = path.join(argv[1], "game")

    RENPY_BASE_DIR = path.dirname(__file__)

    DEFAULT_FONT = "DejaVuSans.ttf"


    def file_template(file, **kwargs):
        with open(path.join(GAME_BASE_DIR, file), "r") as f:
            content = f.read()

        return Template(content).substitute(**kwargs)


    def to_string(thing):
        if thing == None:
            return "null"
        elif type(thing) == bool:
            return "true" if thing else "false"
        elif isinstance(thing, basestring):
            if thing == "True": return "'true'"
            elif thing == "False": return "'false'"
            return "'%s'" % str(thing).replace("'", "\\'").replace("\n", "\\n")
        else:
            return str(thing)


    # js file content
    def main_menu_bg():
        tmp = [i["background"] for i in style.mm_root.properties if "background" in i][-1]
        if tmp[0] != "#" and "." in tmp:
            res = path.join(GAME_BASE_DIR, tmp)
        elif hasattr(gui, "main_menu_background"):
            res = path.join(GAME_BASE_DIR, gui.main_menu_background)
        if res and path.isfile(res):
            return res
        else:
            print("[WARNING] couldn't find main menu background")

    MAIN_MENU_BG = main_menu_bg()


    def main_menu_music():
        if config.main_menu_music:
            return path.join(GAME_BASE_DIR, config.main_menu_music)

    MAIN_MENU_MUSIC = main_menu_music()


    def import_img(relpath, varname):
        if relpath:
            res = path.join(GAME_BASE_DIR, relpath)
            if path.isfile(res):
                return "import %s from '%s';" % (varname, res)
        print("[WARNING] couldn't import %s" % varname)
        return "const %s: string = null;" % varname


    INVALID_CHARS = re.compile(r"[^0-9a-zA-Z_]")

    def remove_invalid_chars(s):
        return re.sub(INVALID_CHARS, '', s.replace(".", "_"))


    ## images
    def imports_and_dic(obj, class_name):
        imports = ""
        dic = "{\n"

        for name, file in obj.iteritems():
            if file:
                # import var from './foo/bar/var.ext';
                imports += "import %s from '%s';\n" % (name, file)

                #     var: new ClassName(var),
                dic += "    %s: new %s(%s),\n" % (name, class_name, name)

        dic += "}"

        return { "imports": imports, "dic": dic }


    def add_image(img_name, img_file, imgs):
        new_img_name = remove_invalid_chars(img_name)

        if new_img_name != img_name:
            print("[INFO] replaced \"%s\" with \"%s\"" % (img_name, new_img_name))

        imgs[new_img_name] = path.join(GAME_BASE_DIR, 'images', img_file)


    def images():
        def img_name_and_file(img):
            name = img.imgname[0]
            if img.code is not None:
                file = renpy.python.py_eval_bytecode(img.code.bytecode)
            else:
                file = renpy.display.motion.ATLTransform(img.atl)
            return (name, file)

        # retrieve all images (removes double assignments)
        imgs = {}
        if MAIN_MENU_BG:
            imgs["main_menu_bg"] = MAIN_MENU_BG

        for key, value in renpy.game.script.namemap.iteritems():
            if isinstance(value, renpy.ast.Image):
                (img_name, img_file) = img_name_and_file(value)

                if isinstance(img_file, basestring):
                    add_image(img_name, img_file, imgs)

        return imports_and_dic(imgs, "Image")


    ## characters
    def characters():
        res = "{\n"

        # get all Define statements
        for key, value in renpy.game.script.namemap.iteritems():
            if isinstance(value, renpy.ast.Define):
                char = renpy.python.py_eval_bytecode(value.code.bytecode)

                # get all the one defining an ADVCharacter
                if value.store == "store" and isinstance(char, renpy.character.ADVCharacter) and value.varname != "_narrator":
                    char_name = value.varname
                    display_name = char.name
                    color = char.who_args["color"] if "color" in char.who_args else None

                    #     jp: new Char('Jean Plank', '#fefefe'),
                    res += "    %s: new Char('%s', %s),\n" % (char_name, display_name, to_string(color))

        res += "}"

        return res


    ## parsing nodes
    def show_unknown_node_warning(node):
        print("[WARNING] unknown node %s found, didn't continue this branch." % (node.diff_info(), ))


    # parses all nodes starting with start_node
    # modifies acc, returns real_next(start_node)'s id
    def parse_nodes(start_node, acc):
        real_start = real_next(start_node)
        nexts = [real_start]

        while len(nexts) != 0:
            node = nexts[0]
            nexts = nexts[1:]

            if node and id(node) not in acc["nodes"]:
                nexts += parse_node(node, acc)

        return id(real_start)


    # returns a list of nodes
    def parse_node(node, acc):
        if isinstance(node, renpy.ast.Menu):
            return menu_to_str(node, acc)
        elif isinstance(node, renpy.ast.Say):
            return say_to_str(node, acc)
        elif isinstance(node, renpy.ast.If):
            return if_to_str(node, acc)
        elif isinstance(node, renpy.ast.Python):
            return python_to_str(node, acc)
        elif isinstance(node, renpy.ast.Scene):
            return scene_to_str(node, acc)
        elif isinstance(node, renpy.ast.Show):
            return show_to_str(node, acc)
        elif isinstance(node, renpy.ast.Hide):
            return hide_to_str(node, acc)
        elif isinstance(node, renpy.ast.UserStatement):
            return play_stop_to_str(node, acc)
        else:
            show_unknown_node_warning(node)
            return []


    def real_next(node):
        if (  isinstance(node, renpy.ast.Menu)
           or isinstance(node, renpy.ast.Say)
           or isinstance(node, renpy.ast.If)
           or isinstance(node, renpy.ast.Python)
           or isinstance(node, renpy.ast.Scene)
           or isinstance(node, renpy.ast.Show)
           or isinstance(node, renpy.ast.Hide)
           or isinstance(node, renpy.ast.UserStatement)):
            return node
        elif isinstance(node, renpy.ast.Jump):
            return real_next(label_by_name(node.target))
        elif (  isinstance(node, renpy.ast.Label)
             or isinstance(node, renpy.ast.Translate)
             or isinstance(node, renpy.ast.EndTranslate)
             or isinstance(node, renpy.ast.Pass)
             or isinstance(node, renpy.ast.Return)):
            return real_next(node.next)
        elif node:
            show_unknown_node_warning(node)


    def menu_to_str(node, acc):
        nexts = []
        menu_items = []
        display_texts = []
        for item in node.items:
            (text, cond, lnext) = item
            if lnext:
                next = real_next(lnext[0])
                id_next = id(next) if next else None

                acc["nodes"][id(item)] = "new MenuItem(%s, %s, %s)" % (
                    to_string(text),
                    to_string(cond),
                    to_string(id_next))
                nexts.append(next)
                menu_items.append(item)
            else:
                display_texts.append(text)

        id_menu_items = [id(menu_item) for menu_item in menu_items]
        acc["nodes"][id(node)] = "new Menu(%s, %s)" % (
            to_string("\n".join(display_texts)),
            str(id_menu_items))

        return nexts


    def say_to_str(node, acc):
        next = real_next(node.next)
        id_next = id(next) if next else None
        acc["nodes"][id(node)] = "new Say(%s, %s, %s)" % (
            to_string(node.who),
            to_string(node.what),
            to_string(id_next))
        return [next]


    def if_to_str(node, acc):
        else_found = False
        for if_block in node.entries:
            if if_block[0] == "True":
                else_found = True
        if not else_found:
            node.entries.append(("True", [node.next]))

        nexts_of_blocks = []
        nexts_of_if = []
        for if_block in node.entries:
            (cond, block) = if_block
            id_if_block = id(if_block)

            next_of_block = real_next(block[0])
            id_next_of_block = id(next_of_block) if next_of_block else None

            acc["nodes"][id_if_block] = "new IfBlock(%s, %s)" % (
                to_string(cond),
                to_string(id_next_of_block))

            nexts_of_blocks.append(next_of_block)
            nexts_of_if.append(id_if_block)

        acc["nodes"][id(node)] = "new If(%s)" % str(nexts_of_if)

        return nexts_of_blocks


    def python_to_str(node, acc):
        next = real_next(node.next)
        id_next = id(next) if next else None
        acc["nodes"][id(node)] = "new PyExpr(%s, %s)" % (
            to_string(node.code.source),
            to_string(id_next))
        return [next]


    def scene_to_str(node, acc):
        next = real_next(node.next)
        id_next = id(next) if next else None
        acc["nodes"][id(node)] = "new Scene(%s, %s)" % (
            to_string(node.imspec[0][0]),
            to_string(id_next))
        return [next]


    def show_to_str(node, acc):
        next = real_next(node.next)
        id_next = id(next) if next else None
        acc["nodes"][id(node)] = "new Show(%s, %s)" % (
            to_string(node.imspec[0][0]),
            to_string(id_next))
        return [next]


    def hide_to_str(node, acc):
        next = real_next(node.next)
        id_next = id(next) if next else None
        acc["nodes"][id(node)] = "new Hide(%s, %s)" % (
            to_string(node.imspec[0][0]),
            to_string(id_next))
        return [next]


    WORD = re.compile(r'([\w.]+|".*?")')

    def play_stop_to_str(node, acc):
        cmd = re.findall(WORD, node.line)

        next = real_next(node.next)
        id_next = id(next) if next else None

        if  cmd[0] == "play" and len(cmd) >= 3:
            channel = cmd[1]
            file = cmd[2][1:-1] # cmd[2] == '"file.ogg"'
            snd_name = remove_invalid_chars(cmd[2])
            acc["snds"][snd_name] = path.join(GAME_BASE_DIR, file)
            acc["nodes"][id(node)] = "new Play(%s, %s, %s)" % (
                to_string(channel),
                to_string(snd_name),
                to_string(id_next))
            return [next]

        elif cmd[0] == "voice" and len(cmd) >= 2:
            file = cmd[1][1:-1] # cmd[1] == '"file.ogg"'
            snd_name = remove_invalid_chars(cmd[1])
            acc["snds"][snd_name] = path.join(GAME_BASE_DIR, file)
            acc["nodes"][id(node)] = "new Play('voice', %s, %s)" % (
                to_string(snd_name),
                to_string(id_next))
            return [next]

        elif cmd[0] == "stop" and len(cmd) >= 2:
            channel = cmd[1]
            acc["nodes"][id(node)] = "new Stop(%s, %s)" % (
                to_string(channel),
                to_string(id_next))
            return [next]

        else:
            print("[WARNING] unrecognized UserStatement: %s, didn't continue this branch." % node.line)


    def label_by_name(name):
        for _key, node in renpy.game.script.namemap.iteritems():
            if isinstance(node, renpy.ast.Label) and node.name == name:
                return node


    def nodes_sounds():
        acc = {
            "snds": {},
            "nodes": {}
        }

        if MAIN_MENU_MUSIC:
            acc["snds"]["main_menu_music"] = MAIN_MENU_MUSIC

        id_start = parse_nodes(label_by_name("start"), acc)

        acc["nodes"][0] = acc["nodes"][id_start]
        del acc["nodes"][id_start]

        nodes_str = "{\n"
        for id_node, node in acc["nodes"].iteritems():
            nodes_str += "    %s: %s,\n" % (id_node, node)
        nodes_str += "}"

        return nodes_str, imports_and_dic(acc["snds"], "Sound")


    # generate js file
    def ts(fonts):
        imgs = images()
        nodes, snds = nodes_sounds()

        main_menu_bg = "main_menu_bg" if MAIN_MENU_BG else None
        main_menu_music = "main_menu_music" if MAIN_MENU_MUSIC else None
        show_name = guiattr("show_name", False)

        datas = {
            "game_name": to_string(config.name),
            "game_version": to_string(config.version),
            "show_name": to_string(show_name),
            "import_game_icon": import_img(config.window_icon, "GAME_ICON"),
            "main_menu_bg": to_string(main_menu_bg),
            "main_menu_music": to_string(main_menu_music),
            "import_main_menu_overlay": import_img("gui/overlay/main_menu.png", "MAIN_MENU_OVERLAY"),
            "import_textbox": import_img("gui/textbox.png", "TEXTBOX_BG"),
            "import_choice_btn_bg": import_img("gui/button/choice_idle_background.png", "CHOICE_BTN_BG"),
            "import_choice_btn_hover": import_img("gui/button/choice_hover_background.png", "CHOICE_BTN_HOVER"),
            "import_namebox_bg": import_img("gui/namebox.png", "NAMEBOX_BG"),
            "import_confirm_overlay": import_img("gui/overlay/confirm.png", "CONFIRM_OVERLAY"),
            "import_frame_bg": import_img("gui/frame.png", "FRAME_BG"),
            "imgs_imports": imgs["imports"],
            "imgs_dic": imgs["dic"],
            "fonts_imports": fonts["imports"],
            "fonts_dic": fonts["dic"],
            "snds_imports": snds["imports"],
            "snds_dic": snds["dic"],
            "chars": characters(),
            "nodes": nodes
        }

        return file_template(TEMPLATE_TS, **datas)


    # generate css file

    # return retrieves gui's gui_attr value if it exists else default
    def guiattr(gui_attr, default):
        if hasattr(gui, gui_attr):
            return getattr(gui, gui_attr)
        else:
            return default


    def fonts():
        def find_font(file):
            res = path.join(GAME_BASE_DIR, file)
            if path.isfile(res):
                return res
            else:
                res = path.join(RENPY_BASE_DIR, "common", file)
                if path.isfile(res):
                    return res

        def add_font(name, gui_attr, fonts):
            file = guiattr(gui_attr, DEFAULT_FONT)
            res = find_font(file)
            if res:
                really_add_font(name, res, fonts)
            else:
                print("[WARNING] couldn't find font %s" % res)
                fonts["dic"][name] = "dejavusans_ttf"

        def really_add_font(name, file, fonts):
            if file in fonts["imports"]:
                # already imported
                fonts["dic"][name] = fonts["imports"][file]
            else:
                fname = remove_invalid_chars(path.basename(file)).lower()
                fonts["imports"][file] = fname
                fonts["dic"][name] = fname

        res = {
            "imports": {},
            "dic": {}
        }

        add_font("dialog", "text_font", res)
        add_font("choicebtn", "choice_button_text_font", res)
        add_font("mmenu", "interface_text_font", res)
        add_font("mmenubtn", "button_text_font", res)
        add_font("namebox", "name_text_font", res)

        font = find_font("DejaVuSans-Bold.ttf")
        if font:
            if not font in res["imports"]:
                res["imports"][font] = "dejavusans_bold_ttf"

        return res

    def fonts_imports(fonts):
        imports = ""
        dic = "{\n"
        for path, fname in fonts["imports"].iteritems():
            imports += "import %s from '%s';\n" % (fname, path)
            if fname == "dejavusans_bold_ttf":
                dic += "    %s: new Font(%s, true),\n" % (fname, fname)
            else:
                dic += "    %s: new Font(%s),\n" % (fname, fname)
        dic += "}"

        return { "imports": imports, "dic": dic }


    GAME_WIDTH = config.screen_width

    GAME_HEIGHT = config.screen_height


    def fontsize(fsize):
        h = 3.11 * fsize / 33 # vh: 33 fsize => 3.11vh
        v = h * GAME_HEIGHT / GAME_WIDTH # vw
        return { "h": "%svh" % round(h, 5), "v": "%svw" % round(v, 5) }


    def yalign(y, self_height, parent_height):
        if y == 0.0:
            return "top: 0"
        # elif y == 0.5:
        #     top = float(parent_height) - self_height / 2
        #     return "top: %s" % percent(top, parent_height)
        else:
            return "bottom: 0"


    def textalign(x):
        if x == 1.0:
            return "right"
        elif x == 0.5:
            return "center"
        else:
            return "left"


    def percent(self_px, parent_px):
        if self_px:
            return str(round(100.0 * self_px / parent_px, 5))+"%"


    def get_or_else(val, els):
        return val if val else els


    def padding(borders, parent_w):
        # margin in percentage is relative to the width of the containing block
        return " ".join([
            percent(borders.top, parent_w),
            percent(borders.right, parent_w),
            percent(borders.bottom, parent_w),
            percent(borders.left, parent_w)
        ])


    def bgtile(tile):
        if tile:
            return "background-repeat: repeat"
        else:
            return "background-size: 100% 100%"


    def mmenubtn_borders():
        left = gui.button_borders.left + 58
        top = gui.button_borders.top + 6
        right = gui.button_borders.right + 145
        bottom = gui.button_borders.bottom + 6
        return Borders(left, top, right, bottom)


    def choicebtn_borders():
        left = gui.choice_button_borders.left
        top = gui.choice_button_borders.top + 2
        right = gui.choice_button_borders.right
        bottom = gui.choice_button_borders.bottom + 2
        return Borders(left, top, right, bottom)


    def new_style(the_fonts):
        namebox = fontsize(gui.name_text_size)
        dialog = fontsize(gui.text_size)
        mmenu = fontsize(gui.interface_text_size)
        mmenuitems_width = round(420.0 * GAME_WIDTH / 1920)
        mmenubtn = fontsize(gui.button_text_size)
        infos_marginright = round(24.0 * GAME_WIDTH / 1788)
        infos_marginbottom = round(32.0 * GAME_HEIGHT / 1006)
        title = fontsize(gui.title_text_size)
        menubtn = fontsize(gui.choice_button_text_size)

        datas = {
            # game
            "game_height": GAME_HEIGHT,
            "game_width": GAME_WIDTH,
            # textbox
            "textbox_height": percent(gui.textbox_height, GAME_HEIGHT),
            "textbox_yalign": yalign(gui.textbox_yalign, gui.textbox_height, GAME_HEIGHT),
            # namebox
            "namebox_bgtile": bgtile(gui.namebox_tile),
            "namebox_padding": padding(gui.namebox_borders, GAME_WIDTH),
            "namebox_ffamily": the_fonts["dic"]["namebox"],
            "namebox_fsize_v": namebox["v"],
            "namebox_fsize": namebox["h"],
            "namebox_width": get_or_else(percent(gui.namebox_width, GAME_WIDTH), "auto"),
            "namebox_height": get_or_else(percent(gui.namebox_height, gui.textbox_height), "auto"),
            "namebox_left": percent(gui.name_xpos, GAME_WIDTH),
            "namebox_top": get_or_else(percent(gui.name_ypos + 5, gui.textbox_height), percent(5, gui.textbox_height)),
            "namebox_txtalign": textalign(gui.name_xalign),
            # dialog
            "dialog_color": gui.text_color,
            "dialog_ffamily": the_fonts["dic"]["dialog"],
            "dialog_fsize_v": dialog["v"],
            "dialog_fsize": dialog["h"],
            "dialog_left": percent(gui.dialogue_xpos, GAME_WIDTH),
            "dialog_top": percent(gui.dialogue_ypos + 5, gui.textbox_height),
            "dialog_txtalign": textalign(gui.dialogue_text_xalign),
            "dialog_width": percent(gui.dialogue_width, GAME_WIDTH),
            # main menu
            "mmenu_ffamily": the_fonts["dic"]["mmenu"],
            "mmenu_fsize_v": mmenu["v"],
            "mmenu_fsize": mmenu["h"],
            # main menu items
            "mmenuitems_width": percent(mmenuitems_width, GAME_WIDTH),
            # main menu button
            "mmenubtn_padding": padding(mmenubtn_borders(), mmenuitems_width),
            "mmenubtn_color_hover": gui.button_text_hover_color,
            "mmenubtn_color": gui.button_text_idle_color,
            "mmenubtn_ffamily": the_fonts["dic"]["mmenubtn"],
            "mmenubtn_fsize": mmenubtn["h"],
            "mmenubtn_fsize_v": mmenubtn["v"],
            "mmenubtn_width": get_or_else(percent(gui.button_width, mmenuitems_width), "auto"),
            "mmenubtn_height": get_or_else(percent(gui.button_height, GAME_HEIGHT), "auto"),
            "mmenubtn_txtalign": textalign(gui.button_text_xalign),
            "disabledbtn_color": gui.insensitive_color,
            # game infos in main menu
            "infos_marginright": percent(infos_marginright, GAME_WIDTH),
            "infos_marginbottom": percent(infos_marginbottom, GAME_WIDTH),
            # game title in main menu
            "title_fsize_v": title["v"],
            "title_fsize": title["h"],
            # choice
            "choice_height": percent(GAME_HEIGHT - gui.textbox_height, GAME_HEIGHT),
            "choice_yalign": yalign(1.0 - gui.textbox_yalign, GAME_HEIGHT - gui.textbox_height, GAME_HEIGHT),
            # choice button
            "choicebtn_bgtile": bgtile(gui.choice_button_tile),
            "choicebtn_padding": padding(choicebtn_borders(), GAME_WIDTH),
            "choicebtn_color_hover": gui.choice_button_text_hover_color,
            "choicebtn_color": gui.choice_button_text_idle_color,
            "choicebtn_ffamily": the_fonts["dic"]["choicebtn"],
            "choicebtn_fsize_v": menubtn["v"],
            "choicebtn_fsize": menubtn["h"],
            "choicebtn_txtalign": textalign(gui.choice_button_text_xalign),
            "choicebtn_width": get_or_else(percent(gui.choice_button_width, GAME_WIDTH), "auto"),
            # confirm frame
            "confirmframe_padding": padding(gui.confirm_frame_borders, GAME_WIDTH),
        }

        return file_template(TEMPLATE_CSS, **datas)


    def old_style(the_fonts):
        # I didn't manage to retrieve the colors automatically, so I hard coded them in template-old.css
        textbox_height = round(232.0 * GAME_HEIGHT / 1080)
        textbox_padding = round(16.0 * GAME_WIDTH / 1920)
        namebox = fontsize(32)
        dialog = fontsize(32)
        mmenubtn = fontsize(34)

        datas = {
            # game
            "game_height": GAME_HEIGHT,
            "game_width": GAME_WIDTH,
            # textbox
            "textbox_height": percent(textbox_height, GAME_HEIGHT),
            "textbox_padding": percent(textbox_padding, GAME_WIDTH),
            # namebox
            "namebox_ffamily": the_fonts["dic"]["namebox"],
            "namebox_fsize": namebox["h"],
            "namebox_fsize_v": namebox["v"],
            # dialog
            "dialog_ffamily": the_fonts["dic"]["dialog"],
            "dialog_fsize": dialog["h"],
            "dialog_fsize_v": dialog["v"],
            # main menu
            "mmenu_ffamily": the_fonts["dic"]["mmenu"],
            # main menu button
            "mmenubtn_fsize": mmenubtn["h"],
            "mmenubtn_fsize_v": mmenubtn["v"],
            "mmenubtn_ffamily": the_fonts["dic"]["mmenubtn"],
        }

        return file_template(TEMPLATE_OLD_CSS, **datas)


    def css():
        the_fonts = fonts()

        try:
            return new_style(the_fonts), fonts_imports(the_fonts)
        except AttributeError as e:
            print()
            print("[ERROR] %s" % e)
            print("You should define the concerned gui attribute.")
            print()
            print("[INFO] falling back to default look")
            return old_style(the_fonts), fonts_imports(the_fonts)


    # generate css and js, and write it to file
    def write_css_ts():
        if not path.exists(OUTPUT_DIR):
            makedirs(OUTPUT_DIR)

        the_css, fonts = css()

        with open(path.join(OUTPUT_DIR, OUTPUT_CSS), "w") as f:
            f.write(the_css)

        with open(path.join(OUTPUT_DIR, OUTPUT_TS), "w") as f:
            f.write(ts(fonts))

    write_css_ts()
