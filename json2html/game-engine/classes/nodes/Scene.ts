import NodeWithImg from './NodeWithImg';

import { IGameProps } from '../GameProps';


export default class Scene extends NodeWithImg {
    load() {
        super.load();
        if (this.image !== null) this.image.load();
    }

    execute(gameProps: IGameProps): Partial<IGameProps> {
        const res = super.execute(gameProps);
        if (this.image !== null) {
            res.sceneImg = this.image;
            res.charImgs = [];
            res.textboxChar = null;
            res.textboxText = '';
        }
        return res;
    }
}
