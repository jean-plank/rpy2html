export const isFullscreen = () => document.fullscreen

export const exitFullscreen = () => document.exitFullscreen()

export const enterFullscreen = () =>
    document.body.requestFullscreen({ navigationUI: 'hide' })
