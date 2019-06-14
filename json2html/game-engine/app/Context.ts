import { lookup } from 'fp-ts/lib/StrMap';

import RenpyJson from 'renpy-json-loader/RenpyJson';
import AppData from '../app/AppData';
import getHelp from '../components/menus/getHelp';
import getSaveSlots, { SaveSlotsType } from '../components/menus/getSaveSlots';
import AstNode from '../nodes/AstNode';
import translations, { Translation } from './translations';

export default class Context {
    data: AppData;
    lang: string;
    transl: Translation;
    firstNode: AstNode;
    SaveSlots: SaveSlotsType;
    help: JSX.Element;

    static fromRenpyJson = (json: RenpyJson): Context => {
        const data = AppData.fromJson(json);
        const lang = data.lang;
        const transl = lookup(data.lang, translations).getOrElse(
            translations.value.en // we're all consenting adults here
        );
        const firstNode = lookup('0', data.nodes).getOrElseL(() => {
            throw EvalError('A node with id 0 is needed to start the story.');
        });
        const SaveSlots = getSaveSlots(data.nodes, firstNode, transl);
        const help = getHelp(data.help);
        return { data, lang, transl, firstNode, SaveSlots, help };
    }
}
