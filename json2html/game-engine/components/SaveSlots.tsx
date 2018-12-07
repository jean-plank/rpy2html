import * as React from 'react';
import * as _ from 'lodash';

import '../styles/SaveSlots.css';

import App from './App';
import SaveSlot from './SaveSlot';

import Save from '../classes/Save';


interface IProps {
    app: App;
    action: (iSlot: number, save: Save | null) => void;
    saves: Array<Save | null>;
}

export default class SaveSlots extends React.Component<IProps> {
    render() {
        const slots: JSX.Element[] =
            _.map(this.props.saves, (save: Save | null, i: number) => {
                const f = () => { this.props.action(i, save); };
                return <SaveSlot key={i}
                                 save={save}
                                 action={f}
                                 emptySlot={this.props.app.lang.emptySlot}
                                 firstNode={
                                     this.props.app.props.datas.nodes[0]
                                 } />;
            });

        return <div className='SaveSlots'>{slots}</div>;
    }
}
