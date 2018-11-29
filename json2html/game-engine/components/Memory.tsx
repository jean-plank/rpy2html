import * as React from 'react';
import * as _ from 'lodash';

import '../styles/Memory.css';

import App from './App';

import IObj from '../classes/IObj';
import StorageService from '../classes/StorageService';
import MemoryGame from './MemoryGame';


interface IProps {
    app: App;
}

interface IState {
    games: IObj<number>;
}

export default class Memory extends React.Component<IProps, IState> {
    private storage: StorageService;

    constructor (props: IProps) {
        super(props);

        this.storage = StorageService.getInstance(props.app);

        this.state = { games: this.storage.allJPGamesStorages() };
    }

    render() {
        let i = -1;
        let total = 0;
        const games: JSX.Element[] =
            _.map(this.state.games, (bytes, key) => {
                i++;
                total += bytes;
                return <MemoryGame key={i}
                                   app={this.props.app}
                                   storageKey={key}
                                   bytes={bytes}
                                   deleteStorage={this.deleteStorage(key)} />;
            });

        return (
            <div className='Memory'>
                <div className='header'
                     dangerouslySetInnerHTML={{
                         __html: this.props.app.lang.memory.about
                     }} />
                <div className='games'>
                    <div>
                        {games.length > 0 ? games
                                          : this.props.app.lang.noGamesYet}
                    </div>
                </div>
                {games.length > 0 ? this.footer(total) : null}
            </div>
        );
    }

    private footer(total: number): JSX.Element {
        return (
            <div className='footer'>
                <MemoryGame app={this.props.app}
                            storageKey={this.props.app.lang.memory.total}
                            bytes={total}
                            deleteStorage={this.deleteAll}
                            deleteAll={true} />
            </div>
        );
    }

    private deleteStorage = (key: string) => () => {
        this.storage.removeItem(key);
        this.setState({ games: this.storage.allJPGamesStorages() });
    }

    private deleteAll = () => {
        _(this.state.games).keys()
                           .forEach(key => { this.deleteStorage(key)(); });
    }
}
