#!/usr/bin/env python

# This script must be run from the root folder of this project.
# This is because ../src/converter/rpy2html.rpy will a create a `src/converted`
# folder in the cwd.

# It only generates the converted js and css files but doesn't make the bundle.

from sys import argv, exit
from os import path, remove
from shutil import copy2
from subprocess import call


if __name__ == "__main__":
    if len(argv) != 4:
        print(
"""Usage:
    compile.py <renpy executable> <renpy game folder> <lang>""")
        exit(1)


    renpy = argv[1]
    game_base = argv[2]
    game_lang = argv[3]
    game = path.join(game_base, "game")
    converter = path.join(path.dirname(__file__), "../src/converter")
    lang_rpy = "lang.rpy"

    to_be_copied = ["rpy2html.rpy", "template.css", "template-old.css", "template.ts"]
    to_be_removed = to_be_copied + [lang_rpy, "rpy2html.rpyc"]

    # initial copy
    def copy2_game(fname):
        f = path.join(converter, fname)
        if path.isfile(f):
            copy2(f, game)

    [copy2_game(f) for f in to_be_copied]

    with open(path.join(game, lang_rpy), "w") as f:
        f.write("define game_lang = \"%s\"\n" % game_lang)

    # compilation
    code = call([renpy, game_base, "compile"])

    if code == 0:
        print("Compilation finished.")
        print("")

    # cleanup anyway
    def remove_from_game(fname):
        f = path.join(game, fname)
        if path.isfile(f):
            remove(f)

    [remove_from_game(f) for f in to_be_removed]

    exit(code)
