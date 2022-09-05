import "./dialog.css";

export interface DialogOptions {
    title: string;
    text: string | null;
    firstButtonText: string | null;
    secondButtonText: string | null;
    showCancelButton: boolean;
    onFirst: (() => void) | null;
    onSecond: (() => void) | null;
    onCancel: (() => void) | null;
}

export const DIALOG_OPTIONS_INIT: DialogOptions = {
    title: "Title",
    text: "Text",
    firstButtonText: "First",
    secondButtonText: "Second",
    showCancelButton: true,
    onFirst: null,
    onSecond: null,
    onCancel: null,
};

interface DialogProps {
    options: DialogOptions;
}

export default function Dialog({
    options: {
        title,
        text,
        firstButtonText,
        secondButtonText,
        showCancelButton,
        onFirst,
        onSecond,
        onCancel,
    },
}: DialogProps) {
    return (
        <div className="dialog-outer-container">
            <div className="dialog-container">
                <h1>{title}</h1>
                {text && <p>{text}</p>}
                <div className="dialog-buttons">
                    {firstButtonText && (
                        <button onClick={(e) => onFirst && onFirst()}>
                            {firstButtonText}
                        </button>
                    )}
                    {secondButtonText && (
                        <button onClick={(e) => onSecond && onSecond()}>
                            {secondButtonText}
                        </button>
                    )}
                    {showCancelButton && (
                        <button onClick={(e) => onCancel && onCancel()}>
                            Cancel
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
