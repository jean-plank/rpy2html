import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './app/App';

const renpyJson = require(`../renpy-json-loader/index!${__INPUT_JSON}`);

ReactDOM.render(<App {...{ renpyJson }} />, document.getElementById('root'));
