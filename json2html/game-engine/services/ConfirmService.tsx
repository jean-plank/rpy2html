import { none, some } from 'fp-ts/lib/Option';
import * as React from 'react';
import { createRef, RefObject } from 'react';

import App from '../app/App';
import Context from '../app/Context';
import { Translation } from '../app/translations';
import getConfirm, { ConfirmType } from '../components/getConfirm';
import { IButton } from '../components/menus/MenuButton';
import KeyUpAble from './KeyUpAble';
import MainMenuService from './MainMenuService';
import Service from './Service';

interface Args {
    app: App;
    context: Context;
    mainMenuService: MainMenuService;
}

export default class ConfirmService implements Service {
    keyUpAble: RefObject<KeyUpAble> = createRef();

    private app: App;
    private mainMenuService: MainMenuService;
    private transl: Translation;
    private confirmAudioShown = false;
    private Confirm: ConfirmType;

    init({ app, mainMenuService, context: { transl } }: Args) {
        this.app = app;
        this.mainMenuService = mainMenuService;
        this.transl = transl;
        this.Confirm = getConfirm({ confirmService: this });
    }

    private confirm = (
        msg: string,
        buttons: IButton[],
        escapeAction?: () => void
    ) => {
        this.app.setConfirm(
            some([
                this,
                // tslint:disable-next-line: jsx-key
                <this.Confirm
                    ref={this.keyUpAble}
                    {...{ msg, buttons, escapeAction }}
                />
            ])
        );
    }

    hideConfirm = () => this.app.setConfirm(none);

    confirmAudio = (okAction: () => void) => {
        if (this.confirmAudioShown) return;
        this.confirmAudioShown = true;
        this.confirm(
            this.transl.confirm.audio,
            [{ text: this.transl.confirm.audioBtn, onClick: okAction }],
            okAction
        );
    }

    confirmYesNo = (
        msg: string,
        actionYes: (e: React.MouseEvent) => void,
        actionNo?: () => void
    ) =>
        this.confirm(
            msg,
            [
                { text: this.transl.confirm.yes, onClick: actionYes },
                { text: this.transl.confirm.no, onClick: actionNo }
            ],
            actionNo
        )

    confirmMainMenu = (unselectBtn: () => void) =>
        this.confirmYesNo(
            this.transl.confirm.unsaved,
            this.mainMenuService.show,
            unselectBtn
        )

    confirmOverride = (save: () => void) =>
        this.confirmYesNo(this.transl.confirm.override, save)
}
