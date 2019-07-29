/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { FunctionComponent, useEffect, useState } from 'react'

import { style, transl } from '../../context'
import SoundService from '../../sound/SoundService'
import Volumes from '../../sound/Volumes'
import {
    enterFullscreen,
    exitFullscreen,
    isFullscreen
} from '../../utils/fullscreen'
import Radio from './Radio'
import Slider from './Slider'

interface Props {
    soundService: SoundService
}

const Preferences: FunctionComponent<Props> = ({ soundService }) => {
    const [isFS, setIsFullscreen] = useState(isFullscreen())

    useEffect(
        () =>
            (document.onfullscreenchange = () =>
                setIsFullscreen(isFullscreen())),
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
                <Radio onClick={exitFullscreen} selected={!isFS}>
                    {transl.prefs.window}
                </Radio>
                <Radio onClick={enterFullscreen} selected={isFS}>
                    {transl.prefs.fullscreen}
                </Radio>
            </div>
        )
    }

    function volume(): JSX.Element {
        return (
            <div css={[styles.group, styles.sliders]}>
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
                    styles={{ container: styles.slider.container }}
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
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'start',
        padding: '0 8%'
    }),

    group: css({
        margin: '2% 0'
    }),

    title: css({
        color: style.accent_color,
        paddingBottom: '0.2em'
    }),

    sliders: css({
        width: '40%'
    }),

    slider: {
        container: css({
            width: '100%',
            ':not(:last-of-type)': {
                marginBottom: '1em'
            }
        })
    }
}
