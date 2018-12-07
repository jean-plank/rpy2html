import * as React from 'react';
import * as _ from 'lodash';

import '../styles/History.css';

import HistoryLine from './HistoryLine';

import Node from '../classes/nodes/Node';
import NodeWithChar from '../classes/nodes/NodeWithChar';


interface IProps {
    nodes: Node[];
}

export default class History extends React.Component<IProps> {
    render() {
        const says: JSX.Element[] = [];
        _.forEach(this.props.nodes, (node: Node, i: number) => {
            if (node instanceof NodeWithChar) {
                says.push(<HistoryLine key={i}
                                       char={node.who}
                                       text={node.what} />);
            }
        });

        return <div ref={this.scrollToBottom}
                    className='History'>{says}</div>;
    }

    private scrollToBottom = (elt: HTMLDivElement | null) => {
        if (elt !== null) elt.scrollTop = elt.scrollHeight - elt.clientHeight;
    }
}
