import * as React from 'react';
import { connect } from 'react-redux';
import { PushupCounter } from './pushup-counter.component';
import { SitupCounter } from './situp-counter.component';
import { RootState, PushupActions, SitupActions } from 'state';

export interface CounterDemoCallbacks {
    onStartPushupAutoCount: () => any,
    onStopPushupAutoCount: () => any,
    onStartSitupAutoCount: () => any,
    onStopSitupAutoCount: () => any
}

export interface CounterDemoState {
    // Nothing to report here
}

export type CounterDemoProps = CounterDemoCallbacks & CounterDemoState;

export const CounterDemo: React.SFC<CounterDemoProps> = (props) => {
    return (
        <div className="counters row">
            <div className="pushups col section">
                <h3>Pushups</h3>
                <PushupCounter />
                <button onClick={props.onStartPushupAutoCount}>Auto Count</button>
                <button onClick={props.onStopPushupAutoCount}>Stop Counting</button>
            </div>
            <div className="situps col section">
                <h3>Situps</h3>
                <SitupCounter />
                <button onClick={props.onStartSitupAutoCount}>Auto Count</button>
                <button onClick={props.onStopSitupAutoCount}>Stop Counting</button>
            </div>
        </div>
    )
}

CounterDemo.defaultProps = {
    onStartPushupAutoCount: () => undefined,
    onStopPushupAutoCount: () => undefined,
    onStartSitupAutoCount: () => undefined,
    onStopSitupAutoCount: () => undefined,
} as CounterDemoProps

const mapStateToProps = (state: RootState): CounterDemoState => ({});
const mapDispatchToProps = (dispatch: any): CounterDemoCallbacks => ({
    onStartPushupAutoCount: () => PushupActions.countOnInterval(1000, 1),
    onStopPushupAutoCount: () => PushupActions.stopInterval(),
    onStartSitupAutoCount: () => SitupActions.countOnInterval(1000, 1),
    onStopSitupAutoCount: () => SitupActions.stopInterval()
});

export const CounterDemoPage = connect(mapStateToProps, mapDispatchToProps)(CounterDemo);
