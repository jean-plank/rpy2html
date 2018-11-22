# need to call it zmain for making it excuted as last

init python:
    import json
    from time import time
    from sys import argv
    from os import path

    from nodes_sounds import parse as parse_nodes_sounds
    from images import parse as parse_images
    from characters import parse as parse_characters
    from fonts import parse as parse_fonts
    from style import parse as parse_style


    config.debug_sound = False

    GAME_BASE_DIR = path.join(argv[1], 'game')
    RENPY_BASE_DIR = path.dirname(__file__)

    # nodes
    res = parse_nodes_sounds(renpy.game.script.namemap, renpy.ast, config)

    # correct sound files names (it is easier to do it that uglier way)
    def correct_sound(sounds, key, sound):
        if sound != None:
            correct = path.join(GAME_BASE_DIR, sound)
            if path.isfile(correct):
                sounds[key] = correct
                return
            else:
                var_name = correct
        else:
            var_name = key
        print('[WARNING] couldn\'t import %s' % var_name)

    sounds = {}
    for key, value in res['sounds'].iteritems():
        correct_sound(sounds, key, value)
    res['sounds'] = sounds

    # add images and correct them
    res['images'] = parse_images(GAME_BASE_DIR,
                                 renpy.game.script.namemap,
                                 renpy.ast.Image,
                                 renpy.python.py_eval_bytecode,
                                 renpy.display.motion.ATLTransform,
                                 config,
                                 gui,
                                 style)

    # add fonts
    fonts = parse_fonts(GAME_BASE_DIR, RENPY_BASE_DIR, gui)
    res['fonts'] = fonts['definitions']

    # add characters
    res['characters'] = parse_characters(renpy.game.script.namemap, renpy.ast.Define, renpy.python.py_eval_bytecode, renpy.character.ADVCharacter)

    # add style
    res['style'] = parse_style(gui, config, fonts['usages'], Borders)

    # lang
    res['lang'] = game_lang # defined in lang.rpy (see ../rpy2json)

    # game name
    res['game_name'] = config.name if config.name else path.basename(argv[1])

    with open(output_file, "w") as f:
        json.dump(res, f, indent=2)
