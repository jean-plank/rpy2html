#!/usr/bin/env python

# This script should be run from the root folder of this project.
# This is because compile.py will a create a `src/converted` folder in the cwd.

from sys import argv
from os import path
from shutil import move
from subprocess import call


if __name__ == "__main__":
    if len(argv) == 3 or len(argv) == 4:
        DEFAULT_OUTPUT = path.abspath(path.join(path.dirname(__file__), "../dist"))

        renpy = argv[1]
        game = argv[2]
        if len(argv) == 4:
            output_dir = path.abspath(argv[3])
        else:
            output_dir = DEFAULT_OUTPUT

        utils = path.dirname(__file__)
        compile = path.join(utils, "compile.py")
        bundle = path.join(utils, "bundle.py")

        code = call([compile, renpy, game])
        if code == 0:
            code = call([bundle])

        # moving to output dir
        if output_dir != DEFAULT_OUTPUT:
            if path.isdir(DEFAULT_OUTPUT):
                move(DEFAULT_OUTPUT, output_dir)

        exit(code)

    else:
        print(
"""Illegal number of parameters, 2 or 3 required

Usage:
    convert.py <path-to-renpy-executable> <path-to-renpy-game-folder> [output-folder=dist]""")
        exit(1)
