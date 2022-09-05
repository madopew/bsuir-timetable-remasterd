import { CSSTransition } from "react-transition-group";
import "./appear-transition.css";

export enum TransitionType {
    bottomToTop,
    fadeIn,
}

interface TransitionProps {
    children: JSX.Element;
    visible: boolean;
    effect: TransitionType;
}

export default function AppearTransition({
    children,
    visible,
    effect,
}: TransitionProps) {
    return (
        <CSSTransition
            in={visible}
            timeout={300}
            classNames={"appear-transition-" + TransitionType[effect]}
            unmountOnExit
        >
            {children}
        </CSSTransition>
    );
}
