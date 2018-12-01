export default interface IGameController {
    execNextIfNotMenu: () => void;
    history: {
        previousBlock: () => void;
        nextBlock: () => void;
    };
    showGameMenu: () => void;
}
