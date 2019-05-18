import AstNode from '../../nodes/AstNode';
import Block from '../../nodes/Block';

const followingBlock = (node: AstNode): Block => {
    return followingBlockRec(node, []);
};
export default followingBlock;

const followingBlockRec = (node: AstNode, acc: Block): Block => {
    const nexts = node.nexts();
    if (nexts.length === 0) return acc;
    if (nexts.length !== 1) {
        throw EvalError(`Node ${node} has more than one next node`);
    }
    const next = nexts[0];
    if (next.stopExecution) return acc.concat(next);
    return followingBlockRec(next, acc.concat(next));
};

//         if (nexts.length === 0) return acc;
//         else if (nexts.length === 1) {
//             let props = acc[1];
//             if (prev !== null) {
//                 props = mergeProps(props, prev.beforeNext(props));
//             }
//             props = mergeProps(props, nexts[0].execute(props));

//             const newAcc: Block = [_.concat(acc[0], nexts[0]), props];

//             if (nexts[0].stopExecution) return newAcc;
//             else return this.getBlock(node, nexts[0], newAcc);
//         } else throw EvalError(`Node ${node} has more than one next node.`);
