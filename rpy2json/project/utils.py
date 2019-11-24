import re


INVALID_CHARS = re.compile(r'[^0-9a-zA-Z_]')


def remove_invalid_chars(s):
    return re.sub(INVALID_CHARS, '', s.replace('.', '_'))


def guiattr(gui, gui_attr, default):
    '''
    Retrieves gui's gui_attr value if it exists else default
    '''
    if hasattr(gui, gui_attr):
        return getattr(gui, gui_attr)
    else:
        return default


def replace_bools(s):
    return s.replace('True', 'true').replace('False', 'false')


def pretty_print(obj, name='obj'):
    for attr in dir(obj):
        try:
            print('%s.%s = %r' % (name, attr, getattr(obj, attr)))
        except Exception as e:
            print('error: %s.%s: %s' % (name, attr, e))
