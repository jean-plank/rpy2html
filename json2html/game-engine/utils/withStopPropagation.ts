import * as React from 'react';

export default (f: () => void) => (e: React.SyntheticEvent) => {
    e.stopPropagation();
    f();
};
