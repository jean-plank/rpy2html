#!/bin/bash

# should be run from the root of this project

# $1 is input_folder
# $2 is output_folder

if [ "$#" -ne 2 ]; then
    echo "Illegal number of parameters, 2 required"
    exit 1
else
    utils/convert-script.sh $1
    utils/bundle.sh
    rm dist/game/bundle.js
    # mv dist/game $2
fi
