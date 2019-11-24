/** @jsx jsx */
import { Interpolation } from '@emotion/core'
import { FunctionComponent } from 'react'

import Video from '../../medias/Video'

export interface Props {
    video: Video
    autoPlay: boolean
}

const Cutscene: FunctionComponent<Props> = ({ video, autoPlay }) =>
    video.reactNode({ autoPlay, css: videoStyles })
export default Cutscene

const videoStyles: Interpolation = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    objectFit: 'contain'
}
