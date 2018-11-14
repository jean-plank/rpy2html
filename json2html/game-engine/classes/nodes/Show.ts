import NodeWithImg from './NodeWithImg';

import GameController from '../GameController';


export default class Show extends NodeWithImg {
    load(): void {
        super.load();
        if (this.image !== null) this.image.load();
    }

    execute(): void {
        super.execute(); // ensures that game isn't null
        if (this.image !== null)
            (this.game as GameController).show(this.image);
    }
}
