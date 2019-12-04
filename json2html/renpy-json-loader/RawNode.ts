import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/pipeable'
import * as t from 'io-ts'
import { optionFromNullable } from 'io-ts-types/lib/optionFromNullable'
import convertToJs from './convertToJs'

const mapType = <A extends { arguments: B }, B>(
    codec: t.Type<A, A, unknown>,
    f: (args: B) => E.Either<unknown, B>
): t.Type<A, A, unknown> =>
    codec.pipe(
        new t.Type<A, A, unknown>(
            codec.name,
            codec.is,
            (s, c) =>
                pipe(
                    codec.decode(s),
                    E.fold(
                        _ => E.left(_),
                        node =>
                            pipe(
                                f(node.arguments),
                                E.fold(
                                    _ => t.failure(s, c),
                                    _ =>
                                        t.success({
                                            ...node,
                                            arguments: _
                                        })
                                )
                            )
                    )
                ),
            codec.encode
        )
    )

const HideType = t.strict({
    class_name: t.literal('Hide'),
    arguments: t.tuple([t.string, t.array(t.string)])
})
const IfType = t.strict({
    class_name: t.literal('If'),
    arguments: t.tuple([t.array(t.string)])
})
const IfBlockType = mapType(
    t.strict({
        class_name: t.literal('IfBlock'),
        arguments: t.tuple([t.string, t.array(t.string)])
    }),
    ([a, b]) => E.either.map(convertToJs(a), _ => [_, b])
)
const MenuType = t.strict({
    class_name: t.literal('Menu'),
    arguments: t.tuple([t.string, t.array(t.string)])
})
const MenuItemType = mapType(
    t.strict({
        class_name: t.literal('MenuItem'),
        arguments: t.tuple([t.string, t.string, t.array(t.string)])
    }),
    ([a, b, c]) => E.either.map(convertToJs(b), _ => [a, _, c])
)
const PauseType = t.strict({
    class_name: t.literal('Pause'),
    arguments: t.tuple([t.array(t.string)])
})
const PlayType = t.strict({
    class_name: t.literal('Play'),
    arguments: t.tuple([t.string, t.string, t.boolean, t.array(t.string)])
})
const PlayVideoType = t.strict({
    class_name: t.literal('Video'),
    arguments: t.tuple([t.string, t.array(t.string)])
})
const PyExprType = mapType(
    t.strict({
        class_name: t.literal('PyExpr'),
        arguments: t.tuple([t.string, t.array(t.string)])
    }),
    ([a, b]) => E.either.map(convertToJs(a), _ => [_, b])
)
const SayType = t.strict({
    class_name: t.literal('Say'),
    arguments: t.tuple([
        optionFromNullable(t.string),
        t.string,
        t.array(t.string)
    ])
})
const SceneType = t.strict({
    class_name: t.literal('Scene'),
    arguments: t.tuple([t.string, t.array(t.string)])
})
const ShowType = t.strict({
    class_name: t.literal('Show'),
    arguments: t.tuple([t.string, t.array(t.string)])
})
const ShowVideoType = t.strict({
    class_name: t.literal('ShowVideo'),
    arguments: t.tuple([t.string, t.array(t.string)])
})
const ShowWindowType = t.strict({
    class_name: t.literal('ShowWindow'),
    arguments: t.tuple([t.boolean, t.array(t.string)])
})
const StopType = t.strict({
    class_name: t.literal('Stop'),
    arguments: t.tuple([t.string, t.array(t.string)])
})

type RawNode =
    | t.TypeOf<typeof HideType>
    | t.TypeOf<typeof IfType>
    | t.TypeOf<typeof IfBlockType>
    | t.TypeOf<typeof MenuType>
    | t.TypeOf<typeof MenuItemType>
    | t.TypeOf<typeof PauseType>
    | t.TypeOf<typeof PlayType>
    | t.TypeOf<typeof PlayVideoType>
    | t.TypeOf<typeof PyExprType>
    | t.TypeOf<typeof SayType>
    | t.TypeOf<typeof SceneType>
    | t.TypeOf<typeof ShowType>
    | t.TypeOf<typeof ShowVideoType>
    | t.TypeOf<typeof ShowWindowType>
    | t.TypeOf<typeof StopType>
export default RawNode

export const RawNodeType = new t.Type<RawNode, null, unknown>(
    'RawNode',
    (_u): _u is RawNode => false,
    (s, c) => {
        const decoders: ((u: unknown) => E.Either<t.Errors, RawNode>)[] = [
            E.alt(() => HideType.decode(s)),
            E.alt(() => IfType.decode(s)),
            E.alt(() => IfBlockType.decode(s)),
            E.alt(() => MenuType.decode(s)),
            E.alt(() => MenuItemType.decode(s)),
            E.alt(() => PauseType.decode(s)),
            E.alt(() => PlayType.decode(s)),
            E.alt(() => PlayVideoType.decode(s)),
            E.alt(() => PyExprType.decode(s)),
            E.alt(() => SayType.decode(s)),
            E.alt(() => SceneType.decode(s)),
            E.alt(() => ShowType.decode(s)),
            E.alt(() => ShowVideoType.decode(s)),
            E.alt(() => ShowWindowType.decode(s)),
            E.alt(() => StopType.decode(s))
        ]
        const res = decoders.reduce<E.Either<t.Errors, RawNode>>(
            (acc, decode) => pipe(acc, decode),
            E.left([
                {
                    value: undefined,
                    context: c,
                    message: 'No matching known node'
                }
            ])
        )
        if (E.isLeft(res)) {
            console.log('s =', s)
        }
        return res
    },
    _ => null
)
