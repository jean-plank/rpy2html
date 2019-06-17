import { KeyboardEvent } from 'react';

export default interface KeyUpAble {
    onKeyUp: (e: KeyboardEvent) => void;
}
