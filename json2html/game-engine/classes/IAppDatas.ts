import { IStyle } from '../../renpy-json-loader/IRenpyJson';

import Node from './nodes/Node';
import IObj from './IObj';
import Char from './Char';
import Image from './Image';
import Sound from './Sound';
import Video from './Video';
import Font from './Font';


// useful stuff to initiate nodes
export default interface IAppDatas {
    gameName: string;
    lang: string;
    help: string;
    nodes: IObj<Node>;
    chars: IObj<Char>;
    images: IObj<Image>;
    sounds: IObj<Sound>;
    videos: IObj<Video>;
    fonts: IObj<Font>;
    style: IStyle;
}
