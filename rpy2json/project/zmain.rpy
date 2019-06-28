# need to be named zmain so Ren'Py executes it in last position

init python:
    import json
    import re
    from time import time
    from sys import argv
    from os import path, listdir

    from nodes_sounds_videos import parse as parse_nodes_sounds_videos
    from images import parse as parse_images
    from characters import parse as parse_characters
    from fonts import parse as parse_fonts
    from style import parse as parse_style


    config.debug_sound = False

    GAME_BASE_DIR = path.join(argv[1], 'game')
    RENPY_BASE_DIR = path.dirname(__file__)

    # nodes
    res = parse_nodes_sounds_videos(renpy.game.script.namemap, renpy.ast, config)


    # correct media files names (it is easier to do it that uglier way)
    MEDIAS = [f for f in listdir(GAME_BASE_DIR) if path.isfile(path.join(GAME_BASE_DIR, f))]

    def correct_media(medias, key, media, media_type):
        if media != None:
            correct = path.join(GAME_BASE_DIR, media)
            if path.isfile(correct):
                medias[key] = correct

            else:
                res = corrected(media)
                if res != None:
                    medias[key] = path.join(GAME_BASE_DIR, res)
                else:
                    print('[WARNING] couldn\'t import file {}'.format(correct))

        else:
            print('[WARNING] couldn\'t import {} with name {}'.format(media_type, key))

    def corrected(media_name):
        for media in MEDIAS:
            res = re.match(media_name, media, re.IGNORECASE)
            if res != None:
                return res.group(0)


    sounds = {}
    for key, value in res['sounds'].iteritems():
        correct_media(sounds, key, value, 'sound')
    res['sounds'] = sounds

    videos = {}
    for key, value in res['videos'].iteritems():
        correct_media(videos, key, value, 'video')
    res['videos'] = videos

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
