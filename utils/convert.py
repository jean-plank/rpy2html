#!/usr/bin/env python

# This script should be run from the root folder of this project.
# This is because compile.py will a create a `dist` folder in the cwd.

from sys import argv
from os import path
from subprocess import call


if __name__ == "__main__":
    if len(argv) == 3:
        renpy = argv[1]
        game = argv[2]

        utils = path.dirname(__file__)
        compile = path.join(utils, "compile.py")
        bundle = path.join(utils, "bundle.py")

        call([compile, renpy, game])
        call([bundle])
    else:
        print(
"""Illegal number of parameters, 2 required

Usage:
    convert.py <path-to-renpy-executable> <path-to-renpy-game-folder>""")
