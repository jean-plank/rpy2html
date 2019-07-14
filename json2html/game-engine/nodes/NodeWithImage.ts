import { lookup } from 'fp-ts/lib/StrMap'

import Image from '../medias/Image'
import NodeWithMedia from './NodeWithMedia'

export default abstract class NodeWithImage extends NodeWithMedia<Image> {
    constructor(imgName: string, idNexts: string[], stopExecution = false) {
        super(
            (data, imgName) => lookup(imgName, data.images),
            imgName,
            idNexts,
            stopExecution
        )
    }
}
