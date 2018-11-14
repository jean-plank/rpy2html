import NodeWithImg from './NodeWithImg';
import GameController from '../GameController';


export default class Hide extends NodeWithImg {
    execute(): void {
        super.execute(); // ensures that game isn't null
        if (this.image !== null) (this.game as GameController).hide(this.image);
    }
}
