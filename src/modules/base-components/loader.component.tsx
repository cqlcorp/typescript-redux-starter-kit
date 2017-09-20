import * as React from 'react';
import './loader.component.scss';

export const Loader: React.SFC<any> = (props) => {
    return (
        <div className="component-loader">
            <div className="dots">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
            </div>
        </div>
    )
}

export interface LoadingSectionProps {
    loading: boolean | undefined
}

export const LoadingSection: React.SFC<LoadingSectionProps> = (props) => {
    const content = props.loading ? <Loader /> : props.children;
    return (
        <div className="component-loading-section">
            { content }
        </div>
    )
}
