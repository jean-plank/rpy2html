import * as React from 'react';


export default interface IKeyboardHandler {
    onKeyUp(e: React.KeyboardEvent): void;
}
