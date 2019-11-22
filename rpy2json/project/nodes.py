import re
from os import path

from images import load as load_image
from medias import load as load_media
from utils import remove_invalid_chars, replace_bools


def parse(GAME_BASE_DIR, renpy, res):
    '''
    Parse all node to a useable format. The node Label named 'start' will be the
    node with id '0'.
    '''
    start_node = label_by_name(renpy, 'start')

    real_start = real_next(renpy, start_node)
    nexts = [real_start]

    while len(nexts) != 0:
        node = nexts[0]
        nexts = nexts[1:]

        if node and id(node) not in res['nodes']:
            nexts += parse_node(GAME_BASE_DIR, renpy, node, res)

    id_start = id(real_start)
    res['nodes'][0] = res['nodes'][id_start]
    del res['nodes'][id_start]


def label_by_name(renpy, name):
    for _key, node in renpy.game.script.namemap.iteritems():
        if isinstance(node, renpy.ast.Label) and node.name == name:
            return node


def show_unknown_node_warning(node):
    print('[WARNING] unknown node %s: %s' %
          (type(node).__name__, node.diff_info()))


# adds node converted to res['nodes']
# if node uses a sound, adds it to res['sounds']
# returns a list of nodes
def parse_node(GAME_BASE_DIR, renpy, node, res):
    if isinstance(node, renpy.ast.Menu):
        return menu_to_str(renpy, node, res)
    elif isinstance(node, renpy.ast.Say):
        return say_to_str(renpy, node, res)
    elif isinstance(node, renpy.ast.If):
        return if_to_str(renpy, node, res)
    elif isinstance(node, renpy.ast.Python):
        return python_to_str(GAME_BASE_DIR, renpy, node, res)
    elif isinstance(node, renpy.ast.Scene):
        return scene_to_str(GAME_BASE_DIR, renpy, node, res)
    elif isinstance(node, renpy.ast.Show):
        return show_to_str(GAME_BASE_DIR, renpy, node, res)
    elif isinstance(node, renpy.ast.Hide):
        return hide_to_str(renpy, node, res)
    elif isinstance(node, renpy.ast.UserStatement):
        return user_statement_to_str(GAME_BASE_DIR, renpy, node, res)
    else:
        show_unknown_node_warning(node)
        return [real_next(renpy, node.next)]


def real_next(renpy, node):
    while True:
        # known nodes
        if (isinstance(node, renpy.ast.Menu)
            or isinstance(node, renpy.ast.Say)
            or isinstance(node, renpy.ast.If)
            or isinstance(node, renpy.ast.Python)
            or isinstance(node, renpy.ast.Scene)
            or isinstance(node, renpy.ast.Show)
            or isinstance(node, renpy.ast.Hide)
                or isinstance(node, renpy.ast.UserStatement)):
            return node
        # don't keep jumps
        elif isinstance(node, renpy.ast.Jump):
            node = label_by_name(renpy, node.target)
        # ignore useless nodes
        elif (isinstance(node, renpy.ast.Label)
                or isinstance(node, renpy.ast.Translate)
                or isinstance(node, renpy.ast.EndTranslate)
                or isinstance(node, renpy.ast.Pass)
                or isinstance(node, renpy.ast.Return)):
            node = node.next
        elif node != None:
            show_unknown_node_warning(node)
            break
        else:
            break


def menu_to_str(renpy, node, res):
    nexts = []
    menu_items = []
    display_texts = []
    for item in node.items:
        (text, cond, lnext) = item
        if lnext:
            next = real_next(renpy, lnext[0])

            res['nodes'][id(item)] = {
                'class_name': 'MenuItem',
                'arguments': [
                    text,
                    replace_bools(cond),
                    [str(id(next))] if next else []
                ]
            }
            nexts.append(next)
            menu_items.append(item)
        else:
            display_texts.append(text)

    id_menu_items = [str(id(menu_item)) for menu_item in menu_items]
    res['nodes'][id(node)] = {
        'class_name': 'Menu',
        'arguments': [
            '\n'.join(display_texts),
            id_menu_items
        ]
    }
    return nexts


def say_to_str(renpy, node, res):
    next = real_next(renpy, node.next)
    res['nodes'][id(node)] = {
        'class_name': 'Say',
        'arguments': [
            node.who,
            node.what,
            [str(id(next))] if next else []
        ]
    }
    return [next]


def if_to_str(renpy, node, res):
    else_found = False
    for if_block in node.entries:
        if if_block[0] == 'True':
            else_found = True
    if not else_found:
        node.entries.append(('true', [node.next]))

    nexts_of_blocks = []
    nexts_of_if = []
    for if_block in node.entries:
        (cond, block) = if_block
        id_if_block = id(if_block)

        next_of_block = real_next(renpy, block[0])

        res['nodes'][id_if_block] = {
            'class_name': 'IfBlock',
            'arguments': [
                replace_bools(cond),
                [str(id(next_of_block))] if next_of_block else []
            ]
        }

        nexts_of_blocks.append(next_of_block)
        nexts_of_if.append(str(id_if_block))

    res['nodes'][id(node)] = {
        'class_name': 'If',
        'arguments': [nexts_of_if],
    }

    return nexts_of_blocks


VIDEO = re.compile(r'^renpy\.movie_cutscene\((.+)\)$')


def python_to_str(GAME_BASE_DIR, renpy, node, res):
    next = real_next(renpy, node.next)

    match = re.search(VIDEO, node.code.source)

    if match != None and len(match.groups()) == 1:  # it's a video
        file = match.group(1)[1:-1]
        vid_name = remove_invalid_chars(file)
        load_media(GAME_BASE_DIR, res, 'videos', vid_name, file)
        res['nodes'][id(node)] = {
            'class_name': 'Video',
            'arguments': [
                vid_name,
                [str(id(next))] if next else []
            ]
        }
    else:
        res['nodes'][id(node)] = {
            'class_name': 'PyExpr',
            'arguments': [
                replace_bools(node.code.source),
                [str(id(next))] if next else []
            ]
        }
    return [next]


def scene_to_str(GAME_BASE_DIR, renpy, node, res):
    next = real_next(renpy, node.next)
    name = node.imspec[0][0]
    load_image(GAME_BASE_DIR, renpy, res, name, node.imspec)
    res['nodes'][id(node)] = {
        'class_name': 'Scene',
        'arguments': [
            name,
            [str(id(next))] if next else []
        ]
    }
    return [next]


def show_to_str(GAME_BASE_DIR, renpy, node, res):
    next = real_next(renpy, node.next)
    name = node.imspec[0][0]
    is_Movie = load_image(GAME_BASE_DIR, renpy, res, name, node.imspec)
    res['nodes'][id(node)] = {
        'class_name': 'ShowVideo' if is_Movie else 'Show',
        'arguments': [
            name,
            [str(id(next))] if next else []
        ]
    }
    return [next]


def hide_to_str(renpy, node, res):
    next = real_next(renpy, node.next)
    res['nodes'][id(node)] = {
        'class_name': 'Hide',
        'arguments': [
            node.imspec[0][0],
            [str(id(next))] if next else []
        ]
    }
    return [next]


WORD = re.compile(r'([\w.]+|".*?")')


def user_statement_to_str(GAME_BASE_DIR, renpy, node, res):
    cmd = re.findall(WORD, node.line)

    next = real_next(renpy, node.next)
    id_nexts = [str(id(next))] if next else []

    if cmd[0] == 'play' and len(cmd) >= 3:
        play_to_str(GAME_BASE_DIR, cmd, node, id_nexts,
                    res, cmd[2][1:-1], cmd[1])
    elif cmd[0] == 'voice' and len(cmd) >= 2:
        play_to_str(GAME_BASE_DIR, cmd, node, id_nexts,
                    res, cmd[1][1:-1], 'voice')
    elif cmd[0] == 'stop' and len(cmd) >= 2:
        stop_to_str(cmd, node, id_nexts, res)
    elif cmd[0] == 'window' and len(cmd) >= 2:
        window_to_str(cmd, node, id_nexts, res)
    elif cmd[0] == 'pause' and len(cmd) >= 1:
        pause_to_str(cmd, node, id_nexts, res)
    else:
        print('[WARNING] unrecognized UserStatement: %s' % node.line)

    return [next]


VIDEO_EXTENSION = ['.webm', '.ogv']


def play_to_str(GAME_BASE_DIR, cmd, node, id_nexts, res, file, channel):
    snd_name = remove_invalid_chars(file)

    _, ext = path.splitext(file)
    media_type = 'videos' if ext in VIDEO_EXTENSION else 'sounds'
    load_media(GAME_BASE_DIR, res, media_type, snd_name, file)

    res['nodes'][id(node)] = {
        'class_name': 'Play',
        'arguments': [
            channel,
            snd_name,
            id_nexts
        ]
    }


def stop_to_str(cmd, node, id_nexts, res):
    channel = cmd[1]
    res['nodes'][id(node)] = {
        'class_name': 'Stop',
        'arguments': [
            channel,
            id_nexts
        ]
    }


def window_to_str(cmd, node, id_nexts, res):
    show = True if cmd[1] == 'show' else False if cmd[1] == 'hide' else None
    if isinstance(show, bool):
        res['nodes'][id(node)] = {
            'class_name': 'ShowWindow',
            'arguments': [
                show,
                id_nexts
            ]
        }
    else:
        print('[WARNING] unrecognized window option: %s' % cmd[1])


def pause_to_str(cmd, node, id_nexts, res):
    res['nodes'][id(node)] = {
        'class_name': 'Pause',
        'arguments': [
            id_nexts
        ]
    }
