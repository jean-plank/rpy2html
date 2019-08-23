import { useEffect } from 'react'

const useKeyUp = (onKeyUp: (e: KeyboardEvent) => void) => {
    useEffect(() => {
        window.addEventListener('keyup', onKeyUp)
        return () => window.removeEventListener('keyup', onKeyUp)
    }, [onKeyUp])
}
export default useKeyUp
