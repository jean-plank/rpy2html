#!/usr/bin/env python

from sys import argv
from os import path
from subprocess import call


if __name__ == "__main__":
    if len(argv) == 1:
        utils = path.dirname(__file__)
        webpack = path.join(utils, "../node_modules/.bin/webpack")
        game_config = path.join(utils, "../game.config.js")

        call([webpack, "--config", game_config])
    else:
        print("Illegal number of parameters, none required")
