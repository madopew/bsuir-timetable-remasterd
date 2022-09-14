import { DialogOptions } from "../components/Dialog/Dialog";

export enum DialogActionType {
    openInfo,
    hide,
}

type DialogInfo = { title: string; text: string | null };

type DialogState = { visible: boolean; options: DialogOptions };

export type DialogAction =
    | { type: DialogActionType.openInfo; info: DialogInfo; close: () => void }
    | { type: DialogActionType.hide };

export default function dialogReducer(
    prevState: DialogState,
    action: DialogAction
): DialogState {
    switch (action.type) {
        case DialogActionType.openInfo:
            return {
                visible: true,
                options: {
                    title: action.info.title,
                    text: action.info.text,
                    firstButtonText: null,
                    secondButtonText: null,
                    showCancelButton: true,
                    onFirst: null,
                    onSecond: null,
                    onCancel: () => action.close(),
                },
            };
        case DialogActionType.hide:
            return { ...prevState, visible: false };
    }
}
