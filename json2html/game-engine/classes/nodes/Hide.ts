import * as _ from 'lodash';

import NodeWithImg from './NodeWithImg';
import { IGameProps } from '../GameProps';


export default class Hide extends NodeWithImg {
    execute(gameProps: IGameProps): Partial<IGameProps> {
        const res = super.execute(gameProps);
        if (this.image !== null) {
            res.charImgs =
                _.filter(gameProps.charImgs, img => img !== this.image);
        }
        return res;
    }
}
