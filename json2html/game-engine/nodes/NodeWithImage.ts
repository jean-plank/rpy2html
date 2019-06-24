import { lookup } from 'fp-ts/lib/StrMap';

import Image from '../models/Image';
import NodeWithMedia from './NodeWithMedia';

interface Args {
    idNexts?: string[];
    stopExecution?: boolean;
}

export default class NodeWithImage extends NodeWithMedia<Image> {
    constructor(
        imgName: string,
        { idNexts = [], stopExecution = false }: Args = {}
    ) {
        super((data, imgName) => lookup(imgName, data.images), imgName, {
            idNexts,
            stopExecution
        });
    }
}
