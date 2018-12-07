import * as React from 'react';
import * as _ from 'lodash';

import '../styles/SaveSlot.css';

import Node from '../classes/nodes/Node';
import Save from '../classes/Save';
import IGameController from '../classes/IGameController';
import Block from '../classes/Block';

import Game from './Game';

import { blocksFromHist } from '../utils/utils';


interface IProps {
    save: Save | null;
    action: (e: React.MouseEvent) => void;
    emptySlot: string; // string for empty slots (instead of save date)
    firstNode: Node;
}

export default class SaveSlot extends React.Component<IProps> {
    private static fakeController: IGameController = {
        execNextIfNotMenu: () => {},
        history: {
            previousBlock: () => {},
            nextBlock: () => {}
        },
        showGameMenu: () => {}
    };

    render() {
        const save: JSX.Element = (() => {
            if (this.props.save !== null) {
                const block: Block | undefined = _.last(
                    blocksFromHist(this.props.save.history,
                                   [this.props.firstNode])
                );
                if (block !== undefined) {
                    const props = block[1];
                    return <Game controller={SaveSlot.fakeController}
                                 sceneImg={props.sceneImg}
                                 charImgs={props.charImgs}
                                 textboxHide={props.textboxHide}
                                 textboxChar={props.textboxChar}
                                 textboxText={props.textboxText}
                                 choices={props.choices}
                                 video={props.video}
                                 videoPaused={true} />;
                }
            }
            return <div className='empty-slot' />;
        })();

        return (
            <div className='SaveSlot' onClick={this.props.action}>
                {save}
                <div className='text'>
                    {this.props.save !== null ? this.props.save.date
                                              : this.props.emptySlot}
                </div>
            </div>
        );
    }
}
