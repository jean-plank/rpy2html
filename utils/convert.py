#!/usr/bin/env python

# This script should be run from the root folder of this project.
# This is because compile.py will a create a `src/converted` folder in the cwd.

from sys import argv
from os import path
from shutil import move
from subprocess import call


if __name__ == "__main__":
    if len(argv) != 4 and len(argv) != 5:
        print(
"""Usage:
    convert.py <renpy executable> <renpy game folder> <lang> [output folder=dist]""")
        exit(1)


    DEFAULT_OUTPUT = path.abspath(path.join(path.dirname(__file__), "../dist"))

    renpy = argv[1]
    game = argv[2]
    game_lang = argv[3]
    if len(argv) == 5:
        output_dir = path.abspath(argv[4])
    else:
        output_dir = DEFAULT_OUTPUT

    utils = path.dirname(__file__)
    compile = path.join(utils, "compile.py")
    bundle = path.join(utils, "bundle.py")

    code = call([compile, renpy, game, game_lang])
    if code == 0:
        code = call([bundle])

    # moving to output dir
    if output_dir != DEFAULT_OUTPUT:
        if path.isdir(DEFAULT_OUTPUT):
            move(DEFAULT_OUTPUT, output_dir)

    exit(code)
