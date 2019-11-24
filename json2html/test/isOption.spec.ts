import * as O from 'fp-ts/lib/Option'

import { isOption } from '../weeb-engine/history/GameProps'

describe(isOption, () => {
    it('should return false for base types', () => {
        expect(isOption(2)).toBe(false)
        expect(isOption('2')).toBe(false)
        expect(isOption(true)).toBe(false)
        expect(isOption(null)).toBe(false)
        expect(isOption(undefined)).toBe(false)
        expect(isOption([1, 2])).toBe(false)
        expect(isOption({ a: 1, b: 1 })).toBe(false)
    })

    it('should return true for options', () => {
        expect(isOption(O.some(2))).toBe(true)
        expect(isOption(O.none)).toBe(true)
    })
})
