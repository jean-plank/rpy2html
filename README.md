# rpy2html

Convert RenPy games to a single index.html

## Usage

You need to install [`nodejs`](https://nodejs.org) (which comes with `npm`).

Being at the root of this project:

* First, install dependencies of the project: 

        npm install

* Then, to convert a RenPy game:

        npm run convert <input_folder> <output_folder>

Where `input_folder` is your RenPy exported game folder.  
`output_folder` is the folder where your web bundle should be exported.


### Commands details

* `convert-script <input_folder>`: takes all the `*.rpy` files in `input_folder/game` and outputs `converted.js` and `converted.css` bundled file in `dist`

* `bundle`: uses the two previously converted files and the `src/game-engine` to create a unique bundle in `dist/game`

* `convert <input_folder> <output_folder>`: runs `convert-script` and `bundle`, removes `dist/game/bundle.js` (to keep only `index.html` and assets) and moves `dist/game` to `output_folder`


## Project structure

### `src/converter`

Parses and converts the `.rpy` files to a `script.js` and a `style.css`.


### `src/game-engine`

Implements the functions called by `script.js` created by the converter. Also includes a `defaut.css` and the `index.html`.
