from os import path

from medias import load as load_media


def load(GAME_BASE_DIR, renpy, res, name, imspec):
    '''
    Return True if image is a renpy.display.video.Movie.
    '''
    target = renpy.display.image.ImageReference(imspec[0])._target()

    if hasattr(target, 'filename'):
        load_media(GAME_BASE_DIR, res, 'images', name, target.filename)
    else:
        img = find_image(GAME_BASE_DIR, renpy, imspec[0])
        if img != None:
            if isinstance(img, basestring):
                img_name = img
            else:
                value = renpy.python.py_eval_bytecode(img.code.bytecode)
                if isinstance(value, renpy.display.video.Movie):
                    return True
                else:
                    img_name = value
            load_media(GAME_BASE_DIR, res, 'images',
                       name, path.join('images', img_name))
        else:
            print('[WARNING] couldn\'t import image %s' % imspec[0][0])
    return False


def find_image(GAME_BASE_DIR, renpy, img_name):
    for _key, value in renpy.game.script.namemap.iteritems():
        if isinstance(value, renpy.ast.Image) and img_name == value.imgname:
            return value

    img_name = img_name[0]
    for ext in ['png', 'jpg', 'jpeg', 'ico']:
        with_ext = '%s.%s' % (img_name, ext)
        if path.isfile(path.join(GAME_BASE_DIR, 'images', with_ext)):
            return with_ext


def load_default_images(GAME_BASE_DIR, config, gui, style, res):
    def load(key, value):
        load_media(GAME_BASE_DIR, res, 'images', key, value)

    load('game_icon', config.window_icon)
    load('main_menu_bg', main_menu_bg(GAME_BASE_DIR, gui, style))
    load('game_menu_bg', game_menu_bg(GAME_BASE_DIR, gui))
    load('main_menu_overlay', 'gui/overlay/main_menu.png')
    load('game_menu_overlay', 'gui/overlay/game_menu.png')
    load('textbox_bg', 'gui/textbox.png')
    load('choice_btn_bg', 'gui/button/choice_idle_background.png')
    load('choice_btn_hover', 'gui/button/choice_hover_background.png')
    load('slot_bg', 'gui/button/slot_idle_background.png')
    load('slot_hover', 'gui/button/slot_hover_background.png')
    load('namebox_bg', 'gui/namebox.png')
    load('confirm_overlay', 'gui/overlay/confirm.png')
    load('frame_bg', 'gui/frame.png')


def main_menu_bg(GAME_BASE_DIR, gui, style):
    tmp = [i['background']
           for i in style.mm_root.properties if 'background' in i][-1]
    if tmp[0] != '#' and '.' in tmp:
        res = path.join(GAME_BASE_DIR, tmp)
    elif hasattr(gui, 'main_menu_background'):
        res = path.join(GAME_BASE_DIR, gui.main_menu_background)
    if res and path.isfile(res):
        return res


def game_menu_bg(GAME_BASE_DIR, gui):
    if hasattr(gui, 'game_menu_background'):
        res = path.join(GAME_BASE_DIR, gui.game_menu_background)
        if res and path.isfile(res):
            return res
