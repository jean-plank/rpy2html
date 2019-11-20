from os import path

from utils import remove_invalid_chars, guiattr


DEFAULT_FONT = 'DejaVuSans.ttf'
DEFAULT_FONT_NAME = remove_invalid_chars(DEFAULT_FONT).lower()


def parse(GAME_BASE_DIR, RENPY_BASE_DIR, gui):
    '''
    Parse fonts.
    '''
    res = {
        'definitions': {
            # 'font_family': {
            #     'src': str,
            #     'bold': bool
            # },
            # ...
        },
        'usages': {
            # 'dialog': 'font_family'
            # ...
        }
    }

    # add default font definition
    file = find_font(GAME_BASE_DIR, RENPY_BASE_DIR, DEFAULT_FONT)
    if file:
        if not DEFAULT_FONT_NAME in res['definitions']:
            res['definitions'][DEFAULT_FONT_NAME] = {
                'src': file,
                'bold': True
            }
    else:
        print('Couldn\'t find default font')

    add_font = partial_add_font(GAME_BASE_DIR, RENPY_BASE_DIR, gui)
    add_font('dialog', 'text_font', res)
    add_font('choicebtn', 'choice_button_text_font', res)
    add_font('mmenu', 'interface_text_font', res)
    add_font('guibtn', 'button_text_font', res)
    add_font('namebox', 'name_text_font', res)

    return res


def partial_add_font(GAME_BASE_DIR, RENPY_BASE_DIR, gui):
    def res(usage, gui_attr, fonts):
        fpath = guiattr(gui, gui_attr, DEFAULT_FONT)
        full_fpath = find_font(GAME_BASE_DIR, RENPY_BASE_DIR, fpath)

        if full_fpath:
            fname = remove_invalid_chars(fpath).lower()
            if fname in fonts['definitions']:
                # definition already exists
                fonts['usages'][usage] = fname
            else:
                fonts['definitions'][fname] = {
                    'src': full_fpath,
                    'bold': False
                }
                fonts['usages'][usage] = fname
        else:
            ('[WARNING] couldn\'t find font \'%s\', replacing with default font' % fpath)
            fonts['usages'][usage] = DEFAULT_FONT_NAME

    return res


def find_font(GAME_BASE_DIR, RENPY_BASE_DIR, file):
    '''
    :returns: file's full path if it exists in GAME_BASE_DIR or
              RENPY_BASE_DIR/common
    '''
    res = path.join(GAME_BASE_DIR, file)
    if path.isfile(res):
        return res
    else:
        res = path.join(RENPY_BASE_DIR, 'common', file)
        if path.isfile(res):
            return res
