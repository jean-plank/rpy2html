import * as React from 'react';

import '../styles/SaveSlot.css';

import Save from '../classes/Save';
import Game from './Game';


interface IProps {
    save: Save | null;
    action: (e: React.MouseEvent) => void;
    emptySlot: string;
}

export default class SaveSlot extends React.Component<IProps> {
    render() {
        const fakeController = {
            execNextIfNotMenu: () => {},
            history: {
                previousBlock: () => {},
                nextBlock: () => {}
            }
        };

        return (
            <div className='SaveSlot' onClick={this.props.action}>
                {this.props.save !== null
                    ? <Game controller={fakeController}
                            game={this.props.save.gameProps} />
                    : <div className='empty-slot' />}

                <div className='text'>
                    {this.props.save !== null ? this.props.save.date
                                              : this.props.emptySlot}
                </div>
            </div>
        );
    }
}
