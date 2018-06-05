#!/bin/bash

# should be run from the root of this project

if [ "$#" -ne 1 ]; then
    echo "Illegal number of parameters, 1 required"
    exit 1
else
    node src/converter/index.js $1
fi
