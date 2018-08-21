#!/usr/bin/env python

# This script should be run from the root folder of this project.
# This is because ../src/converter/rpy2html.rpy will a create a `dist` folder in
# the cwd.

# It only generates the converted js and css files but doesn't make the bundle.

from sys import argv
from os import path
from shutil import copy2, rmtree
from subprocess import call


if __name__ == "__main__":
    if len(argv) == 3:
        renpy = argv[1]
        game = argv[2]

        utils = path.dirname(__file__)
        rpy2html = path.join(utils, "../src/converter/rpy2html.rpy")

        rmtree("dist")

        copy2(rpy2html, path.join(game, "game"))

        call([renpy, game, "compile"])
    else:
        print(
"""Illegal number of parameters, 2 required

Usage:
    compile.py <path-to-renpy-executable> <path-to-renpy-game-folder>""")
