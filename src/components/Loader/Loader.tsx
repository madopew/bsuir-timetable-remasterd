import React from "react";
import './Loader.css';

interface LoaderProps {
    isLoading: boolean,
    children: React.ReactNode
}

export default function Loader({isLoading, children}: LoaderProps) {
    return isLoading
        ? (
            <div className="Loader">
                <div className="lds-ripple">
                    <div></div>
                    <div></div>
                </div>
            </div>
        )
        : (
            <>
                {children}
            </>
        );
}