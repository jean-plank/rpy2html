/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import * as A from 'fp-ts/lib/Array'
import * as O from 'fp-ts/lib/Option'
import { FunctionComponent } from 'react'

import AstNode from '../../../nodes/AstNode'
import NodeWithChar from '../../../nodes/NodeWithChar'
import HistoryLine from './HistoryLine'

interface Props {
    nodes: AstNode[]
}

const History: FunctionComponent<Props> = ({ nodes }) => (
    <div ref={scrollToBottom} css={historyStyles}>
        {A.filterMapWithIndex<AstNode, JSX.Element>((i, node) =>
            node instanceof NodeWithChar
                ? O.some(
                      <HistoryLine key={i} char={node.who} text={node.what} />
                  )
                : O.none
        )(nodes)}
    </div>
)
export default History

const scrollToBottom = (elt: HTMLDivElement | null) => {
    if (elt !== null) elt.scrollTop = elt.scrollHeight - elt.clientHeight
}

const historyStyles = css({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflowY: 'auto'
})
