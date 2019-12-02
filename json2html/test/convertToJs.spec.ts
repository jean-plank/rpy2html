import convertToJs from '../weeb-engine/utils/convertToJs'

describe(convertToJs, () => {
    it('should convert js', () => {
        const match = (a: string, b: string) =>
            expect(convertToJs(a)).toStrictEqual(b)

        match(`a="abc"`, `window._a="abc"`)
        match(`a12 = 123`, `window._a12 = 123`)
        match(`abc123 = def456 + 1`, `window._abc123 = window._def456 + 1`)
        match(`abc123 = 1 + def456`, `window._abc123 = 1 + window._def456`)
        match(`a = b + 2 + c + 1`, `window._a = window._b + 2 + window._c + 1`)
        match(`a12.toto = 123`, `window._a12.toto = 123`)

        match(`a==1`, `window._a===1`)
        match(`2 <= a`, `2 <= window._a`)
        match(`b > a`, `window._b > window._a`)

        match(`a = b == 2`, `window._a = window._b === 2`)
        match(`a = 3 > 123`, `window._a = 3 > 123`)

        match(`a += 1`, `window._a += 1`)

        match(`a ++`, `window._a ++`)
        match(`a++`, `window._a++`)
    })
})
