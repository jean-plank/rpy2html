import { none, Option } from 'fp-ts/lib/Option';

import AppData from '../app/AppData';
import Media from '../models/medias/Media';
import AstNode, { InitArgs } from './AstNode';

interface Args {
    idNexts?: string[];
    stopExecution?: boolean;
}

export default abstract class NodeWithMedia<T extends Media> extends AstNode {
    protected mediaName: string;
    protected media: Option<T> = none;

    private fromData: (data: AppData, mediaName: string) => Option<T>;

    constructor(
        fromData: (data: AppData, mediaName: string) => Option<T>,
        mediaName: string,
        { idNexts = [], stopExecution = false }: Args = {}
    ) {
        super({ idNexts, stopExecution });
        this.fromData = fromData;
        this.mediaName = mediaName;
    }

    toString(): string {
        return `${this.constructor.name}("${this.mediaName}")`;
    }

    load() {
        this.media.map(_ => _.load());
    }

    init({ id, data, execThenExecNext }: InitArgs) {
        super.init({ id, data, execThenExecNext });
        this.media = this.fromData(data, this.mediaName);
        if (this.media.isNone()) {
            console.warn(
                `${this.constructor.name}: invalid name: ${this.mediaName}`
            );
        }
    }
}
