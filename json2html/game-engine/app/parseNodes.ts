import { Either } from 'fp-ts/lib/Either';
import * as t from 'io-ts';

import { RawNode } from '../../renpy-json-loader/RenpyJson';

import AstNode from '../nodes/AstNode';
import Hide from '../nodes/Hide';
import If from '../nodes/If';
import IfBlock from '../nodes/IfBlock';
import Menu from '../nodes/Menu';
import MenuItem from '../nodes/MenuItem';
import Play from '../nodes/Play';
import PlayVideo from '../nodes/PlayVideo';
import PyExpr from '../nodes/PyExpr';
import Say from '../nodes/Say';
import Scene from '../nodes/Scene';
import Show from '../nodes/Show';
import Stop from '../nodes/Stop';

const parseNode = (rawNode: RawNode): AstNode => {
    return (Hide.decode(rawNode) as Either<t.Errors, AstNode>)
        .alt(If.decode(rawNode))
        .alt(IfBlock.decode(rawNode))
        .alt(Menu.decode(rawNode))
        .alt(MenuItem.decode(rawNode))
        .alt(Play.decode(rawNode))
        .alt(PlayVideo.decode(rawNode))
        .alt(PyExpr.decode(rawNode))
        .alt(Say.decode(rawNode))
        .alt(Scene.decode(rawNode))
        .alt(Show.decode(rawNode))
        .alt(Stop.decode(rawNode))
        .fold(
            errors => {
                console.error(errors);
                throw EvalError("Couldn't parse nodes");
            },
            _ => _
        );
};
export default parseNode;
