/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { FunctionComponent, useEffect, useState } from 'react'

import { style, transl } from '../../context'
import SoundService from '../../sound/SoundService'
import Volumes from '../../sound/Volumes'
import Radio from './Radio'
import Slider from './Slider'

interface Props {
    soundService: SoundService
}

const Preferences: FunctionComponent<Props> = ({ soundService }) => {
    const [isFullscreen, setIsFullscreen] = useState(document.fullscreen)

    useEffect(
        () =>
            (document.onfullscreenchange = () =>
                setIsFullscreen(document.fullscreen)),
        []
    )

    return (
        <div css={styles.container}>
            {document.fullscreenEnabled ? display() : null}
            {volume()}
        </div>
    )

    function display(): JSX.Element {
        return (
            <div css={styles.group}>
                <div css={styles.title}>{transl.prefs.display}</div>
                <Radio onClick={windowed} selected={!isFullscreen}>
                    {transl.prefs.window}
                </Radio>
                <Radio onClick={fullscreen} selected={isFullscreen}>
                    {transl.prefs.fullscreen}
                </Radio>
            </div>
        )
    }

    function windowed() {
        document.exitFullscreen()
    }

    function fullscreen() {
        document.body.requestFullscreen({ navigationUI: 'hide' })
    }

    function volume(): JSX.Element {
        return (
            <div css={styles.group}>
                <div css={styles.title}>{transl.prefs.volume}</div>
                {['music', 'sound', 'voice'].map(getSlider)}
            </div>
        )

        function getSlider(chanName: keyof Volumes, key: number): JSX.Element {
            return (
                <Slider
                    key={key}
                    title={transl.prefs[chanName]}
                    defaultValue={soundService.volumes[chanName]}
                    setValue={setVolume(chanName)}
                />
            )
        }

        function setVolume(chanName: keyof Volumes): (volume: number) => void {
            return volume => soundService.setVolume(chanName, volume)
        }
    }
}
export default Preferences

const styles = {
    container: css({
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center'
    }),

    group: css({
        marginLeft: '4%'
    }),

    title: css({
        color: style.accent_color,
        paddingBottom: '0.2em'
    })
}
