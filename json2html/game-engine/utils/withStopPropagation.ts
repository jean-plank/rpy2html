import * as React from 'react'

const withStopPropagation = (f: () => void) => (
    e: React.SyntheticEvent | Event
) => {
    e.stopPropagation()
    f()
}
export default withStopPropagation
