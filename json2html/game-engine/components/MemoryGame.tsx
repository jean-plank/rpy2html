import * as React from 'react';

import '../styles/MemoryGame.css';

import { formatNumber } from '../utils/utils';

import App from './App';
import MenuButton from './MenuButton';


export interface IProps {
    app: App;
    storageKey: string;
    bytes: number;
    deleteStorage: () => void;
    deleteAll?: boolean;
}

export default class MemoryGame extends React.Component<IProps> {
    render() {
        const strBytes =
            formatNumber(this.props.bytes, this.props.app.props.datas.lang)
            + ' ' + this.props.app.lang.bytes;
        const strDel =
            this.props.deleteAll ? this.props.app.lang.memory.deleteAll
                                 : this.props.app.lang.memory.delete;

        return (
            <div className='MemoryGame'>
                <div className='key'>{this.props.storageKey}</div>
                <div className='bytes'>{strBytes}</div>
                <div className='btn'>
                    <MenuButton
                        text={'× ' + strDel}
                        action={this.props.deleteStorage} />
                </div>
            </div>
        );
    }
}
