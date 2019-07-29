import re
from os import path

from utils import remove_invalid_chars, replace_bools


def parse(renpy_nodes, renpy_ast, config):
    """
    Parse all node to a useable format. The node Label named 'start' will be the
    node with id '0'.

    :param renpy_nodes: all nodes from renpy game (renpy.game.script.namemap)
    :param renpy_ast:   the renpy ast module (renpy.ast)
    :returns:           a dict with all nodes and sounds:
    {
        'nodes': {
            '0': {
                'class_name': 'Say',
                'arguments': ['char_name', 'Hello World!', [1]]
            },
            ...
        },
        'sounds': {
            ...
        }
    }
    """
    res = {
        'nodes': {},
        'sounds': {},
        'videos': {}
    }

    res['sounds']['main_menu_music'] = config.main_menu_music

    start_node = label_by_name(renpy_nodes, renpy_ast.Label, 'start')

    real_start = real_next(renpy_nodes, renpy_ast, start_node)
    nexts = [real_start]

    while len(nexts) != 0:
        node = nexts[0]
        nexts = nexts[1:]

        if node and id(node) not in res['nodes']:
            nexts += parse_node(renpy_nodes, renpy_ast, node, res)

    id_start = id(real_start)
    res['nodes'][0] = res['nodes'][id_start]
    del res['nodes'][id_start]

    return res


def label_by_name(renpy_nodes, renpy_Label, name):
    for _key, node in renpy_nodes.iteritems():
        if isinstance(node, renpy_Label) and node.name == name:
            return node


def show_unknown_node_warning(node):
    print('[WARNING] unknown node {}: {}'.format(type(node).__name__, node.diff_info()))


# adds node converted to acc['nodes']
# if node uses a sound, adds it to acc['sounds']
# returns a list of nodes
def parse_node(renpy_nodes, renpy_ast, node, acc):
    if isinstance(node, renpy_ast.Menu):
        return menu_to_str(renpy_nodes, renpy_ast, node, acc)
    elif isinstance(node, renpy_ast.Say):
        return say_to_str(renpy_nodes, renpy_ast, node, acc)
    elif isinstance(node, renpy_ast.If):
        return if_to_str(renpy_nodes, renpy_ast, node, acc)
    elif isinstance(node, renpy_ast.Python):
        return python_to_str(renpy_nodes, renpy_ast, node, acc)
    elif isinstance(node, renpy_ast.Scene):
        return scene_to_str(renpy_nodes, renpy_ast, node, acc)
    elif isinstance(node, renpy_ast.Show):
        return show_to_str(renpy_nodes, renpy_ast, node, acc)
    elif isinstance(node, renpy_ast.Hide):
        return hide_to_str(renpy_nodes, renpy_ast, node, acc)
    elif isinstance(node, renpy_ast.UserStatement):
        return user_statement_to_str(renpy_nodes, renpy_ast, node, acc)
    else:
        show_unknown_node_warning(node)
        return [real_next(renpy_nodes, renpy_ast, node.next)]


def real_next(renpy_nodes, renpy_ast, node):
    while True:
        # known nodes
        if (  isinstance(node, renpy_ast.Menu)
           or isinstance(node, renpy_ast.Say)
           or isinstance(node, renpy_ast.If)
           or isinstance(node, renpy_ast.Python)
           or isinstance(node, renpy_ast.Scene)
           or isinstance(node, renpy_ast.Show)
           or isinstance(node, renpy_ast.Hide)
           or isinstance(node, renpy_ast.UserStatement)):
            return node
        # don't keep jumps
        elif isinstance(node, renpy_ast.Jump):
            node = label_by_name(renpy_nodes, renpy_ast.Label, node.target)
        # ignore useless nodes
        elif (  isinstance(node, renpy_ast.Label)
             or isinstance(node, renpy_ast.Translate)
             or isinstance(node, renpy_ast.EndTranslate)
             or isinstance(node, renpy_ast.Pass)
             or isinstance(node, renpy_ast.Return)):
            node = node.next
        elif node:
            show_unknown_node_warning(node)
            break
        else:
            break


def menu_to_str(renpy_nodes, renpy_ast, node, acc):
    nexts = []
    menu_items = []
    display_texts = []
    for item in node.items:
        (text, cond, lnext) = item
        if lnext:
            next = real_next(renpy_nodes, renpy_ast, lnext[0])

            acc['nodes'][id(item)] = {
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
    acc['nodes'][id(node)] = {
        'class_name': 'Menu',
        'arguments': [
            '\n'.join(display_texts),
            id_menu_items
        ]
    }
    return nexts


def say_to_str(renpy_nodes, renpy_ast, node, acc):
    next = real_next(renpy_nodes, renpy_ast, node.next)
    acc['nodes'][id(node)] = {
        'class_name': 'Say',
        'arguments': [
            node.who,
            node.what,
            [str(id(next))] if next else []
        ]
    }
    return [next]


def if_to_str(renpy_nodes, renpy_ast, node, acc):
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

        next_of_block = real_next(renpy_nodes, renpy_ast, block[0])

        acc['nodes'][id_if_block] = {
            'class_name': 'IfBlock',
            'arguments': [
                replace_bools(cond),
                [str(id(next_of_block))] if next_of_block else []
            ]
        }

        nexts_of_blocks.append(next_of_block)
        nexts_of_if.append(str(id_if_block))

    acc['nodes'][id(node)] = {
        'class_name': 'If',
        'arguments': [nexts_of_if],
    }

    return nexts_of_blocks


VIDEO = re.compile(r'^renpy\.movie_cutscene\((.+)\)$')

def python_to_str(renpy_nodes, renpy_ast, node, acc):
    next = real_next(renpy_nodes, renpy_ast, node.next)

    match = re.search(VIDEO, node.code.source)

    if match != None and len(match.groups()) == 1: # it's a video
        file = match.group(1)[1:-1]
        vid_name = remove_invalid_chars(file)
        acc['videos'][vid_name] = file
        acc['nodes'][id(node)] = {
            'class_name': 'Video',
            'arguments': [
                vid_name,
                [str(id(next))] if next else []
            ]
        }
    else:
        acc['nodes'][id(node)] = {
            'class_name': 'PyExpr',
            'arguments': [
                replace_bools(node.code.source),
                [str(id(next))] if next else []
            ]
        }
    return [next]


def scene_to_str(renpy_nodes, renpy_ast, node, acc):
    next = real_next(renpy_nodes, renpy_ast, node.next)
    acc['nodes'][id(node)] = {
        'class_name': 'Scene',
        'arguments': [
            node.imspec[0][0],
            [str(id(next))] if next else []
        ]
    }
    return [next]


def show_to_str(renpy_nodes, renpy_ast, node, acc):
    next = real_next(renpy_nodes, renpy_ast, node.next)
    acc['nodes'][id(node)] = {
        'class_name': 'Show',
        'arguments': [
            node.imspec[0][0],
            [str(id(next))] if next else []
        ]
    }
    return [next]


def hide_to_str(renpy_nodes, renpy_ast, node, acc):
    next = real_next(renpy_nodes, renpy_ast, node.next)
    acc['nodes'][id(node)] = {
        'class_name': 'Hide',
        'arguments': [
            node.imspec[0][0],
            [str(id(next))] if next else []
        ]
    }
    return [next]


WORD = re.compile(r'([\w.]+|".*?")')

def user_statement_to_str(renpy_nodes, renpy_ast, node, acc):
    cmd = re.findall(WORD, node.line)

    next = real_next(renpy_nodes, renpy_ast, node.next)
    id_nexts = [str(id(next))] if next else []

    if  cmd[0] == 'play' and len(cmd) >= 3:
        play_to_str(cmd, node, id_nexts, acc, cmd[2][1:-1], cmd[1])
    elif cmd[0] == 'voice' and len(cmd) >= 2:
        play_to_str(cmd, node, id_nexts, acc, cmd[1][1:-1], 'voice')
    elif cmd[0] == 'stop' and len(cmd) >= 2:
        stop_to_str(cmd, node, id_nexts, acc)
    elif cmd[0] == 'window' and len(cmd) >= 2:
        window_to_str(cmd, node, id_nexts, acc)
    elif cmd[0] == 'pause' and len(cmd) >= 1:
        pause_to_str(cmd, node, id_nexts, acc)
    else:
        print('[WARNING] unrecognized UserStatement: %s' % node.line)

    return [next]

def play_to_str(cmd, node, id_nexts, acc, file, channel):
    snd_name = remove_invalid_chars(file)
    acc['sounds'][snd_name] = file
    acc['nodes'][id(node)] = {
        'class_name': 'Play',
        'arguments': [
            channel,
            snd_name,
            id_nexts
        ]
    }

def stop_to_str(cmd, node, id_nexts, acc):
    channel = cmd[1]
    acc['nodes'][id(node)] = {
        'class_name': 'Stop',
        'arguments': [
            channel,
            id_nexts
        ]
    }

def window_to_str(cmd, node, id_nexts, acc):
    show = True if cmd[1] == 'show' else False if cmd[1] == 'hide' else None
    if isinstance(show, bool):
        acc['nodes'][id(node)] = {
            'class_name': 'ShowWindow',
            'arguments': [
                show,
                id_nexts
            ]
        }
    else:
        print('[WARNING] unrecognized window option: {}'.format(cmd[1]))

def pause_to_str(cmd, node, id_nexts, acc):
    acc['nodes'][id(node)] = {
        'class_name': 'Pause',
        'arguments': [
            id_nexts
        ]
    }
