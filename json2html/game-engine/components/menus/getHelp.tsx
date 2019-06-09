import * as React from 'react';

import * as styles from './__style/Help.css';

const getHelp = (html: string): JSX.Element => {
    return (
        <div
            className={styles.help}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
};
export default getHelp;
