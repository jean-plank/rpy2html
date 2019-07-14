/** @jsx jsx */
import { css, jsx, SerializedStyles } from '@emotion/core'
import { last } from 'fp-ts/lib/Array'
import { fromNullable, Option, some } from 'fp-ts/lib/Option'
import { lookup, StrMap } from 'fp-ts/lib/StrMap'
import {
    forwardRef,
    RefForwardingComponent,
    useEffect,
    useImperativeHandle
} from 'react'

import GameProps from '../../gameHistory/GameProps'
import Video from '../../models/medias/Video'
import AstNode from '../../nodes/AstNode'
import Menu from '../../nodes/Menu'
import SoundService from '../../SoundService'
import withStopPropagation from '../../utils/withStopPropagation'
import { GameAble, KeyUpAble } from '../App'
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
    currentNodeL: () => Option<AstNode>;
    showMainMenu: () => void;
    addBlock: (block: AstNode[]) => void;
    redo: () => void;
    onVideoEnded: (execNextIfNotMenu: () => void) => void;
}

const Game: RefForwardingComponent<GameAble, Props> = (
    {
        gameProps,
        isSaveSlot = false,
        armlessWankerMenuProps,
        styles: stylesOverride = {}
    },
    ref
) => {
    useImperativeHandle(ref, () => ({
        onKeyUp,
        execThenExecNext
    }))

    const args = fromNullable(armlessWankerMenuProps)

    useEffect(() => {
        gameProps.video.map(video =>
            args.map(({ onVideoEnded }) =>
                video.onEnded(() => onVideoEnded(execNextIfNotMenu))
            )
        )
    }, [gameProps.video])

    useEffect(() => {
        args.map(_ => _.soundService.applySounds(gameProps.sounds))
    }, [gameProps.sounds])

    useEffect(() => {
        args.map(_ => _.soundService.applyAudios(gameProps.audios))
    }, [gameProps.audios])

    return gameProps.video
        .map(_ => cutsceneLayout(_))
        .getOrElseL(defaultLayout)

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
                {args.map(armlessWankerMenu).toNullable()}
            </div>
        )
    }

    function armlessWankerMenu(props: ArmlessWankerMenuProps) {
        return <ArmlessWankerMenu {...props} />
    }

    function onKeyUp(e: React.KeyboardEvent) {
        const keyEvents = new StrMap<(e: React.KeyboardEvent) => void>({
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
            s: ifArgsExists(({ quickSave }) => quickSave()),
            l: ifArgsExists(({ quickLoad }) => quickLoad())
        })
        lookup(e.key, keyEvents).map(action => {
            e.preventDefault()
            e.stopPropagation()
            action(e)
        })
    }

    function onClick(e: React.MouseEvent) {
        if (e.button === 0) execNextIfNotMenu()
        else if (e.button === 1) args.map(({ showGameMenu }) => showGameMenu())
    }

    function onWheel(e: React.WheelEvent) {
        if (e.deltaY < 0) args.map(({ undo }) => undo())
        else if (e.deltaY > 0) args.map(({ redo }) => redo())
    }

    function execThenExecNext(node: AstNode) {
        execute(some([node, ...node.followingBlock().getOrElse([])]))
    }

    function execNextIfNotMenu() {
        args.map(({ currentNodeL }) =>
            currentNodeL().map(node => {
                if (!(node instanceof Menu)) execute(node.followingBlock())
            })
        )
    }

    function execute(maybeBlock: Option<AstNode[]>) {
        args.map(({ showMainMenu, addBlock }) =>
            maybeBlock.foldL(showMainMenu, block => {
                last(block).map(_ => _.nexts().forEach(_ => _.loadBlock()))
                addBlock(block)
            })
        )
    }

    function ifArgsExists(
        f: (args: ExtendedArmlessWankerProps) => void
    ): () => void {
        return () => args.map(_ => f(_))
    }
}
export default forwardRef<KeyUpAble, Props>(Game)

const gameStyles = css({
    position: 'absolute',
    outline: 'none',
    height: '100%',
    width: '100%'
})
