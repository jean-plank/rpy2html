import { Do } from 'fp-ts-contrib/lib/Do'
import * as A from 'fp-ts/lib/Array'
import * as E from 'fp-ts/lib/Either'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'
import fs from 'fs'
import * as t from 'io-ts'
import path from 'path'
import * as webpack from 'webpack'

import Obj from './Obj'
import RenpyJson, { RawRenpyJson, RawRenpyJsonType } from './RenpyJson'

function loader(this: webpack.loader.LoaderContext, source: string) {
    const callback: webpack.loader.loaderCallback = pipe(
        O.fromNullable(this.async()),
        O.getOrElse(() => {
            throw new EvalError('this.async() is undefined')
        })
    )

    const content: unknown = JSON.parse(source)
    pipe(
        RawRenpyJsonType.decode(content),
        E.fold(
            errors => callback(EvalError(prettyErrors(errors))),
            renpyJson =>
                loadAllFiles(this, renpyJson, (err, res) => {
                    pipe(
                        err,
                        O.fold(() => callback(null, res), callback)
                    )
                })
        )
    )
}
module.exports = loader

function loadAllFiles(
    webpack: webpack.loader.LoaderContext,
    renpyJson: RawRenpyJson,
    callback: (err: O.Option<Error>, res?: string | Buffer) => void
) {
    const res: TE.TaskEither<Error, RenpyJson> = Do(TE.taskEither)
        .bindL('help', () => loadHelp(webpack, renpyJson.lang))
        .bindL('images', () => loadFilesStr(webpack, renpyJson.images))
        .bindL('sounds', () => loadFilesStr(webpack, renpyJson.sounds))
        .bindL('videos', () => loadFilesStr(webpack, renpyJson.videos))
        .bindL('fonts', () =>
            loadFiles(
                webpack,
                renpyJson.fonts,
                _ => _.src,
                (font, src) => ({ src, bold: font.bold })
            )
        )
        .return(modified => ({
            ...renpyJson,
            ...modified
        }))
    res().then(
        pipe(
            E.fold(
                _ => callback(O.some(_)),
                _ =>
                    callback(
                        O.none,
                        JSON.stringify(_)
                            .replace(/\u2028/g, '\\u2028')
                            .replace(/\u2029/g, '\\u2029')
                    )
            )
        )
    )
}

function loadFilesStr(
    webpack: webpack.loader.LoaderContext,
    files: Record<string, string>
): TE.TaskEither<Error, Record<string, string>> {
    return loadFiles(
        webpack,
        files,
        _ => _,
        (_old, _) => _
    )
}

function loadFiles<A>(
    webpack: webpack.loader.LoaderContext,
    files: Record<string, A>,
    getPath: (file: A) => string,
    changePath: (file: A, newPath: string) => A
): TE.TaskEither<Error, Record<string, A>> {
    return pipe(
        T.task.of(Object.entries(files)),
        T.chain(_ => {
            const tasks = _.map(([key, val]) =>
                pipe(
                    loadFile(webpack, val, getPath, changePath),
                    TE.map<A, [string, A]>(_ => [key, _])
                )
            )
            return A.array.sequence(TE.taskEither)(tasks)
        }),
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
    webpack: webpack.loader.LoaderContext,
    file: A,
    getPath: (file: A) => string,
    changePath: (file: A, newPath: string) => A
): TE.TaskEither<Error, A> {
    return () =>
        new Promise<E.Either<Error, A>>(resolve =>
            webpack.loadModule(
                getPath(file),
                (err, _source, _sourceMap, module) =>
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
                O.map(([_]) => {
                    console.log('before =', _)
                    console.log('after =', changePath(file, _))

                    return changePath(file, _)
                }),
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
    webpack: webpack.loader.LoaderContext,
    lang: string
): TE.TaskEither<Error, string> {
    return () =>
        new Promise<E.Either<Error, string>>(resolve => {
            const file = path.join(__dirname, `../help/${lang}.md`)

            fs.existsSync(file) && fs.lstatSync(file).isFile()
                ? webpack.loadModule(file, (err, res) =>
                      resolve(loadHelpCallback(err, res))
                  )
                : resolve(E.left(EvalError(`Couldn't find help file: ${file}`)))
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
        A.filterMap(error => {
            if (error.message !== undefined) {
                return O.some(error.message)
            }
            const [path, last] = error.context.reduce(
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
            return pipe(
                last,
                O.map(l =>
                    l.actual === undefined
                        ? `Missing field ${path}`
                        : `Invalid value at ${path}: expected ${l.type.name} got ${l.actual}`
                )
            )
        }),
        A.map(_ => `- ${_}`)
    ).join('\n')
    return `while parsing json:\n${res}\n`
}
