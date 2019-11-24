# This file has to be named zmain so Ren'Py executes it in last position.

init python:
    import json
    from time import time
    from sys import argv
    from os import path

    from characters import parse as parse_characters
    from fonts import parse as parse_fonts
    from images import load_default_images
    from medias import load as load_media
    from nodes import parse as parse_nodes
    from style import parse as parse_style

    config.debug_sound = False

    GAME_BASE_DIR = path.join(argv[1], 'game')
    RENPY_BASE_DIR = path.dirname(__file__)

    # add fonts
    fonts = parse_fonts(GAME_BASE_DIR, RENPY_BASE_DIR, gui)

    res = {
        'game_name': config.name if config.name else path.basename(argv[1]),
        'lang': game_lang,  # defined in lang.rpy (see ../bin/rpy2json)
        'style': parse_style(gui, config, fonts['usages'], Borders),
        'fonts': fonts['definitions'],
        'characters': parse_characters(renpy),
        'images': {},
        'sounds': {},
        'videos': {},
        'nodes': {}
    }

    load_media(GAME_BASE_DIR, res, 'sounds',
               'main_menu_music', config.main_menu_music)

    load_default_images(GAME_BASE_DIR, config, gui, style, res)
    parse_nodes(GAME_BASE_DIR, renpy, res)

    with open(output_file, 'w') as f:
        json.dump(res, f, indent=2)
