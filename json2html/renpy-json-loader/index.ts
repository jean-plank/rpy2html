import { Do } from 'fp-ts-contrib/lib/Do'
import * as A from 'fp-ts/lib/Array'
import * as E from 'fp-ts/lib/Either'
import * as IO from 'fp-ts/lib/IO'
import * as IOE from 'fp-ts/lib/IOEither'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'
import fs from 'fs'
import * as t from 'io-ts'
import path from 'path'
import * as webpack from 'webpack'

import Font from './Font'
import Obj from './Obj'
import RenpyJson, { RawRenpyJson, RawRenpyJsonType } from './RenpyJson'

function loader(this: webpack.loader.LoaderContext, source: string) {
    pipe(
        pureLoader(this, source)(),
        E.mapLeft(_ => {
            throw _
        })
    )
}
module.exports = loader

function pureLoader(
    wpck: webpack.loader.LoaderContext,
    source: string
): IOE.IOEither<Error, void> {
    return pipe(
        O.fromNullable(wpck.async()),
        O.fold(
            () => () => E.left(EvalError('this.async() is undefined')),
            _ =>
                pipe(
                    wpckCallback(wpck, source, _),
                    IO.map(_ => E.right((() => {})()))
                )
        )
    )
}

function wpckCallback(
    wpck: webpack.loader.LoaderContext,
    source: string,
    callback: webpack.loader.loaderCallback
): IO.IO<void> {
    return () =>
        pipe(
            parseJson(wpck, source),
            E.fold(callback, _ =>
                _().then(_ =>
                    pipe(
                        _,
                        E.fold(callback, _ => callback(null, jsonToStr(_)))
                    )
                )
            )
        )
}

function jsonToStr(renpyJson: RenpyJson): string {
    return JSON.stringify(renpyJson)
        .replace(/\u2028/g, '\\u2028')
        .replace(/\u2029/g, '\\u2029')
}

function parseJson(
    wpck: webpack.loader.LoaderContext,
    source: string
): E.Either<Error, TE.TaskEither<Error, RenpyJson>> {
    return pipe(
        E.parseJSON(source, E.toError),
        E.chain(content =>
            pipe(
                RawRenpyJsonType.decode(content),
                E.fold(
                    _ => E.left(SyntaxError(prettyErrors(_))),
                    _ => E.right(loadAllFiles(wpck, _))
                )
            )
        )
    )
}

function loadAllFiles(
    wpck: webpack.loader.LoaderContext,
    rawRenpyJson: RawRenpyJson
): TE.TaskEither<Error, RenpyJson> {
    return Do(TE.taskEither)
        .bindL('help', () => loadHelp(wpck, rawRenpyJson.lang))
        .bindL('images', () => loadMedias(wpck, rawRenpyJson.images))
        .bindL('sounds', () => loadMedias(wpck, rawRenpyJson.sounds))
        .bindL('videos', () => loadMedias(wpck, rawRenpyJson.videos))
        .bindL('fonts', () => loadFonts(wpck, rawRenpyJson.fonts))
        .return(modified => ({
            ...rawRenpyJson,
            ...modified
        }))
}

function loadMedias(
    wpck: webpack.loader.LoaderContext,
    files: Record<string, string>
): TE.TaskEither<Error, Record<string, string>> {
    return loadFiles(
        wpck,
        files,
        _ => _,
        (_old, _) => _
    )
}

function loadFonts(
    wpck: webpack.loader.LoaderContext,
    files: Record<string, Font>
): TE.TaskEither<Error, Record<string, Font>> {
    return loadFiles(
        wpck,
        files,
        _ => _.src,
        (font, src) => ({ src, bold: font.bold })
    )
}

function loadFiles<A>(
    wpck: webpack.loader.LoaderContext,
    files: Record<string, A>,
    getPath: (file: A) => string,
    changePath: (file: A, newPath: string) => A
): TE.TaskEither<Error, Record<string, A>> {
    const tasks = Object.entries(files).map(([key, val]) =>
        pipe(
            loadFile(wpck, val, getPath, changePath),
            TE.map<A, [string, A]>(_ => [key, _])
        )
    )
    return pipe(
        A.array.sequence(TE.taskEither)(tasks),
        TE.map(_ =>
            _.reduce<Record<string, A>>(
                (acc, [key, value]) => ({
                    ...acc,
                    [key]: value
                }),
                {}
            )
        )
    )
}

function loadFile<A>(
    wpck: webpack.loader.LoaderContext,
    file: A,
    getPath: (file: A) => string,
    changePath: (file: A, newPath: string) => A
): TE.TaskEither<Error, A> {
    return () =>
        new Promise<E.Either<Error, A>>(resolve =>
            wpck.loadModule(getPath(file), (err, _src, _map, module) =>
                resolve(loadFileCallback(file, err, module, changePath))
            )
        )
}

function loadFileCallback<A>(
    file: A,
    err: Error | null,
    module: webpack.Module,
    changePath: (file: A, newPath: string) => A
): E.Either<Error, A> {
    return pipe(
        O.fromNullable(err),
        O.fold(() => {
            const assets: Obj<unknown> = (module as any).buildInfo.assets
            return pipe(
                A.head(Object.entries(assets)),
                O.map(([_]) => changePath(file, _)),
                E.fromOption(() =>
                    EvalError(
                        `Loading file: didn't find output file: "${file}"`
                    )
                )
            )
        }, E.left)
    )
}

function loadHelp(
    wpck: webpack.loader.LoaderContext,
    lang: string
): TE.TaskEither<Error, string> {
    const file = path.join(__dirname, `../help/${lang}.md`)

    if (!(fs.existsSync(file) && fs.lstatSync(file).isFile())) {
        return T.task.of(E.left(EvalError(`Couldn't find help file: ${file}`)))
    }

    return () =>
        new Promise<E.Either<Error, string>>(resolve => {
            wpck.loadModule(file, (err, res) =>
                resolve(loadHelpCallback(err, res))
            )
        })
}

function loadHelpCallback(
    err: Error | null,
    res: string
): E.Either<Error, string> {
    const result = pipe(
        O.fromNullable(err),
        O.fold(
            () =>
                pipe(
                    t.string.decode(eval(res)),
                    E.fold(
                        _ => E.left(EvalError(`While loading help: ${_}`)),
                        _ => E.right(_)
                    )
                ),
            E.left
        )
    )
    return result
}

function prettyErrors(errors: t.Errors): string {
    const res = pipe(
        errors,
        A.filterMap(error =>
            pipe(
                O.fromNullable(error.message),
                O.fold(
                    () => pipe(error, errorPath, lastToString),
                    _ => O.some(_)
                )
            )
        ),
        A.map(_ => `- ${_}`)
    ).join('\n')
    return `Error while parsing json:\n${res}\n`
}

function errorPath(
    error: t.ValidationError
): [string, O.Option<t.ContextEntry>] {
    return error.context.reduce(
        ([acc], entry) => [
            entry.key === ''
                ? acc
                : acc === ''
                ? entry.key
                : `${acc}.${entry.key}`,
            O.some(entry)
        ],
        ['', O.none] as [string, O.Option<t.ContextEntry>]
    )
}

function lastToString([path, last]: [
    string,
    O.Option<t.ContextEntry>
]): O.Option<string> {
    return pipe(
        last,
        O.map(l =>
            l.actual === undefined
                ? `Missing field ${path}`
                : `Invalid value at ${path}: expected ${l.type.name} got ${l.actual}`
        )
    )
}
