import * as React from 'react';
import { CounterState } from './counter.models';
import './counter.styles.scss';

export interface CounterCallbacks {
    onIncrement: () => void,
    onDecrement: () => void,
    onSetCount: (count: number) => void
}

export type CounterProps = CounterCallbacks & CounterState;

export const Counter: React.SFC<CounterProps> = (props) => {
    return (
        <div className="component-counter">
            <button className="increment-button minus" onClick={() => props.onDecrement()}>-</button>
            <input name="count" value={props.count} onChange={(e) => props.onSetCount(parseInt(e.target.value))} />
            <button className="increment-button plus" onClick={() => props.onIncrement()}>+</button>
        </div>
    )
}

Counter.defaultProps = {
    onIncrement: () => null,
    onDecrement: () => null,
    onSetCount: () => null,
}
