import * as React from 'react';

import '../styles/Help.css';


export interface IButton {
    html: string;
}

export default class Help extends React.Component<IButton> {
    render() {
        return (
            <div className='Help'
                 dangerouslySetInnerHTML={{ __html: this.props.html }} />
        );
    }
}
