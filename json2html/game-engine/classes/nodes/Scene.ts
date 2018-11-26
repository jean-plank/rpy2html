import NodeWithImg from './NodeWithImg';

import GameController from '../GameController';


export default class Scene extends NodeWithImg {
    load() {
        super.load();
        if (this.image !== null) this.image.load();
    }

    execute() {
        super.execute(); // ensures that game isn't null
        if (this.image !== null) {
            (this.game as GameController).scene(this.image);
        }
    }
}
