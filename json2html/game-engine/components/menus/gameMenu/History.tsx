import * as React from 'react';
import { FunctionComponent } from 'react';

import * as styles from './__style/History.css';

import AstNode from '../../../nodes/AstNode';
import NodeWithChar from '../../../nodes/NodeWithChar';
import HistoryLine from './HistoryLine';

interface Props {
    nodes: AstNode[];
}

const History: FunctionComponent<Props> = ({ nodes }) => (
    <div ref={scrollToBottom} className={styles.history}>
        {nodes.reduce<JSX.Element[]>(
            (acc, node, i) =>
                node instanceof NodeWithChar
                    ? [
                          ...acc,
                          <HistoryLine
                              key={i}
                              char={node.who}
                              text={node.what}
                          />
                      ]
                    : acc,
            []
        )}
    </div>
);
export default History;

const scrollToBottom = (elt: HTMLDivElement | null) => {
    if (elt !== null) elt.scrollTop = elt.scrollHeight - elt.clientHeight;
};
