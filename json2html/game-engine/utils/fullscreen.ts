export const isFullscreen = (): boolean => document.fullscreenElement !== null

export const exitFullscreen = (): Promise<void> => document.exitFullscreen()

export const enterFullscreen = (): Promise<void> =>
    document.body.requestFullscreen({ navigationUI: 'hide' })
