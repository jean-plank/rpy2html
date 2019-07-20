/** @jsx jsx */
import { css, jsx, SerializedStyles } from '@emotion/core'
import * as A from 'fp-ts/lib/Array'
import * as O from 'fp-ts/lib/Option'
import * as R from 'fp-ts/lib/Record'
import {
    forwardRef,
    RefForwardingComponent,
    useEffect,
    useImperativeHandle
} from 'react'

import { pipe } from 'fp-ts/lib/pipeable'
import GameProps from '../../history/GameProps'
import Video from '../../medias/Video'
import AstNode from '../../nodes/AstNode'
import Menu from '../../nodes/Menu'
import Obj from '../../Obj'
import SoundService from '../../sound/SoundService'
import withStopPropagation from '../../utils/withStopPropagation'
import { KeyUpAble } from '../App'
import ArmlessWankerMenu, { ArmlessWankerMenuProps } from './ArmlessWankerMenu'
import Choices from './Choices'
import Cutscene from './Cutscene'
import LayerImages from './LayerImages'
import LayerScene from './LayerScene'
import Textbox from './Textbox'

interface Props {
    gameProps: GameProps
    isSaveSlot?: boolean
    armlessWankerMenuProps?: ExtendedArmlessWankerProps
    styles?: {
        container?: SerializedStyles;
        namebox?: SerializedStyles;
        dialog?: SerializedStyles;
        choice?: SerializedStyles;
    }
}

type ExtendedArmlessWankerProps = ArmlessWankerMenuProps & {
    soundService: SoundService;
    currentNodeL: () => O.Option<AstNode>;
    showMainMenu: () => void;
    addBlock: (block: AstNode[]) => void;
    redo: () => void;
    onVideoEnded: (execNextIfNotMenu: () => void) => void;
}

const Game: RefForwardingComponent<KeyUpAble, Props> = (
    {
        gameProps,
        isSaveSlot = false,
        armlessWankerMenuProps,
        styles: stylesOverride = {}
    },
    ref
) => {
    useImperativeHandle(ref, () => ({
        onKeyUp
    }))

    const args = O.fromNullable(armlessWankerMenuProps)

    useEffect(() => {
        pipe(
            gameProps.video,
            O.map(video =>
                pipe(
                    args,
                    O.map(({ onVideoEnded }) =>
                        video.onEnded(() => onVideoEnded(execNextIfNotMenu))
                    )
                )
            )
        )
    }, [gameProps.video])

    useEffect(() => {
        pipe(
            args,
            O.map(_ => _.soundService.applySounds(gameProps.sounds))
        )
    }, [gameProps.sounds])

    useEffect(() => {
        pipe(
            args,
            O.map(_ => _.soundService.applyAudios(gameProps.audios))
        )
    }, [gameProps.audios])

    return pipe(
        gameProps.video,
        O.map(_ => cutsceneLayout(_)),
        O.getOrElse(defaultLayout)
    )

    function cutsceneLayout(video: Video): JSX.Element {
        return (
            <div
                css={[gameStyles, stylesOverride.container]}
                {...{ onClick, onWheel }}
            >
                <Cutscene video={video} autoPlay={!isSaveSlot} />
            </div>
        )
    }

    function defaultLayout(): JSX.Element {
        return (
            <div
                {...{ onClick, onWheel }}
                css={[gameStyles, stylesOverride.container]}
            >
                <LayerScene image={gameProps.sceneImg} animated={!isSaveSlot} />
                <LayerImages images={gameProps.charImgs} />
                <Textbox
                    hide={gameProps.textboxHide}
                    char={gameProps.textboxChar}
                    styles={stylesOverride}
                >
                    {gameProps.textboxText.split('\n').map((line, i) => (
                        <div key={i}>{line}</div>
                    ))}
                </Textbox>
                <Choices
                    choices={gameProps.choices.map(choice => ({
                        text: choice.text,
                        onClick: withStopPropagation(() =>
                            execThenExecNext(choice)
                        )
                    }))}
                    styles={stylesOverride}
                />
                {pipe(
                    args,
                    O.map(armlessWankerMenu),
                    O.toNullable
                )}
            </div>
        )
    }

    function armlessWankerMenu(props: ArmlessWankerMenuProps) {
        return <ArmlessWankerMenu {...props} />
    }

    function onKeyUp(e: KeyboardEvent) {
        const keyEvents: Obj<(e: KeyboardEvent) => void> = {
            ArrowUp: () => {},
            ArrowDown: () => {},
            ArrowLeft: () => {},
            ArrowRight: () => {},
            Escape: ifArgsExists(({ showGameMenu }) => showGameMenu()),
            ' ': execNextIfNotMenu,
            Enter: execNextIfNotMenu,
            Control: () => {},
            Tab: () => {},
            PageUp: ifArgsExists(({ undo }) => undo()),
            PageDown: ifArgsExists(({ redo }) => redo()),
            h: () => {},
            v: () => {},
            s: ifArgsExists(({ savesHook: { quickSave } }) => quickSave()),
            l: ifArgsExists(({ quickLoad }) => quickLoad())
        }
        pipe(
            R.lookup(e.key, keyEvents),
            O.map(action => {
                e.preventDefault()
                e.stopPropagation()
                action(e)
            })
        )
    }

    function onClick(e: React.MouseEvent) {
        if (e.button === 0) execNextIfNotMenu()
        else if (e.button === 1) {
            pipe(
                args,
                O.map(({ showGameMenu }) => showGameMenu())
            )
        }
    }

    function onWheel(e: React.WheelEvent) {
        if (e.deltaY < 0) {
            pipe(
                args,
                O.map(({ undo }) => undo())
            )
        } else if (e.deltaY > 0) {
            pipe(
                args,
                O.map(({ redo }) => redo())
            )
        }
    }

    function execThenExecNext(node: AstNode) {
        execute(
            O.some([
                node,
                ...pipe(
                    node.followingBlock(),
                    O.getOrElse(() => [])
                )
            ])
        )
    }

    function execNextIfNotMenu() {
        pipe(
            args,
            O.map(({ currentNodeL }) =>
                pipe(
                    currentNodeL(),
                    O.map(node => {
                        if (!(node instanceof Menu)) {
                            execute(node.followingBlock())
                        }
                    })
                )
            )
        )
    }

    function execute(maybeBlock: O.Option<AstNode[]>) {
        pipe(
            args,
            O.map(({ showMainMenu, addBlock }) =>
                pipe(
                    maybeBlock,
                    O.fold(showMainMenu, block => {
                        pipe(
                            A.last(block),
                            O.map(_ => _.nexts().forEach(_ => _.loadBlock()))
                        )
                        addBlock(block)
                    })
                )
            )
        )
    }

    function ifArgsExists(
        f: (args: ExtendedArmlessWankerProps) => void
    ): () => void {
        return () =>
            pipe(
                args,
                O.map(_ => f(_))
            )
    }
}
export default forwardRef<KeyUpAble, Props>(Game)

const gameStyles = css({
    position: 'absolute',
    outline: 'none',
    height: '100%',
    width: '100%'
})
