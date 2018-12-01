from os import path


def parse(GAME_BASE_DIR,
          renpy_nodes,
          renpy_Image,
          py_eval_bytecode,
          ATLTransform,
          config,
          gui,
          style):
    '''
    Retrieves all declared images in renpy_nodes

    :param renpy_nodes:      all nodes from renpy game (renpy.game.script.namemap)
    :param renpy_Image:      the renpy Image class (renpy.ast.Image)
    :param py_eval_bytecode: the renpy py_eval_bytecode function (renpy.python.py_eval_bytecode)
    :param ATLTransform:     the renpy ATLTransform function (renpy.display.motion.ATLTransform)
    :returns: a dict with all images
    '''

    # functions
    def img_name_and_file(img):
        name = img.imgname[0]
        if img.code is not None:
            file = py_eval_bytecode(img.code.bytecode)
        else:
            file = ATLTransform(img.atl)
        return (name, file)


    def add(acc, key, relpath):
        if relpath:
            res = path.join(GAME_BASE_DIR, relpath)
            if path.isfile(res):
                acc[key] = res
                return
        if relpath == None:
            var_name = key
        else:
            var_name = relpath
        print('[WARNING] couldn\'t import %s' % var_name)


    def main_menu_bg():
        tmp = [i['background'] for i in style.mm_root.properties if 'background' in i][-1]
        if tmp[0] != '#' and '.' in tmp:
            res = path.join(GAME_BASE_DIR, tmp)
        elif hasattr(gui, 'main_menu_background'):
            res = path.join(GAME_BASE_DIR, gui.main_menu_background)
        if res and path.isfile(res):
            return res


    def game_menu_bg():
        if hasattr(gui, 'game_menu_background'):
            res = path.join(GAME_BASE_DIR, gui.game_menu_background)
            if res and path.isfile(res):
                return res


    def add_file_if_found(res, img_name):
        for ext in ['png', 'jpg', 'jpeg', 'ico']:
            img_file = path.join(GAME_BASE_DIR, 'images', '%s.%s' % (img_name, ext))
            if path.isfile(img_file):
                res[img_name] = img_file
                return
        if not img_name in [
            'black',
            'config.gl_test_image',
            '"#000"'
        ]:
            print('[WARNING] couldn\'t import %s' % img_name)

    # body
    res = {}
    used_imgs = []

    add(res, 'game_icon', config.window_icon)
    add(res, 'main_menu_bg', main_menu_bg())
    add(res, 'game_menu_bg', game_menu_bg())
    add(res, 'main_menu_overlay', 'gui/overlay/main_menu.png')
    add(res, 'game_menu_overlay', 'gui/overlay/game_menu.png')
    add(res, 'textbox_bg', 'gui/textbox.png')
    add(res, 'choice_btn_bg', 'gui/button/choice_idle_background.png')
    add(res, 'choice_btn_hover', 'gui/button/choice_hover_background.png')
    add(res, 'slot_bg', 'gui/button/slot_idle_background.png')
    add(res, 'slot_hover', 'gui/button/slot_hover_background.png')
    add(res, 'namebox_bg', 'gui/namebox.png')
    add(res, 'confirm_overlay', 'gui/overlay/confirm.png')
    add(res, 'frame_bg', 'gui/frame.png')

    for _key, value in renpy_nodes.iteritems():
        if isinstance(value, renpy_Image):
            (img_name, img_file) = img_name_and_file(value)

            if isinstance(img_file, basestring):
                add(res, img_name, path.join('images', img_file))
        elif hasattr(value, 'imspec') and not value.imspec[0][0] in used_imgs:
            used_imgs.append(value.imspec[0][0])

    for img_name in used_imgs:
        if not img_name in res:
            add_file_if_found(res, img_name)

    return res
