#!/usr/bin/env python

from sys import argv
from os import path
from subprocess import call


if __name__ == "__main__":
    if len(argv) == 1:
        utils = path.dirname(__file__)
        webpack = path.join(utils, "../node_modules/.bin/webpack")

        exit(call([webpack]))
    else:
        print("Illegal number of parameters, none required")
        exit(1)
