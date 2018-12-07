import * as _ from 'lodash';

import NodeWithImg from './NodeWithImg';

import { IGameProps } from '../GameProps';


export default class Show extends NodeWithImg {
    load() {
        super.load();
        if (this.image !== null) this.image.load();
    }

    execute(gameProps: IGameProps): Partial<IGameProps> {
        const res = super.execute(gameProps);
        if (this.image !== null) {
            if (gameProps.charImgs.indexOf(this.image) === -1) {
                res.charImgs = _.concat(gameProps.charImgs, this.image);
            }
        }
        return res;
    }
}
