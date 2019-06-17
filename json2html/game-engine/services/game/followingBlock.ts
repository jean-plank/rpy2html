import AstNode from '../../nodes/AstNode';

const followingBlock = (node: AstNode): AstNode[] => {
    return followingBlockRec(node, []);
};
export default followingBlock;

const followingBlockRec = (node: AstNode, acc: AstNode[]): AstNode[] => {
    const nexts = node.nexts();
    if (nexts.length === 0) return acc;
    if (nexts.length !== 1) {
        throw EvalError(`Node ${node} has more than one next node`);
    }
    const next = nexts[0];
    if (next.stopExecution) return [...acc, next];
    return followingBlockRec(next, [...acc, next]);
};
