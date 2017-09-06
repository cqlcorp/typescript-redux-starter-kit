import { delay } from 'redux-saga';
import { put } from 'redux-saga/effects';
import { ReduxController, ReduxAction, Reducer, Action, Saga, StateDefaults } from 'redux-controller';
import { IncrementIntervalPayload, IncrementPayload, CounterState } from './counter.models';

@StateDefaults({
    count: 0
} as CounterState)
export class CounterController extends ReduxController<CounterState> {
    @ReduxAction('INCREMENT')
    increment(count: number = 1): Action<IncrementPayload> {
        return this.formatAction({
            count: count
        })
    }

    @ReduxAction('DECREMENT')
    decrement(count: number = 1) {
        return this.formatAction({
            count
        })
    }

    @ReduxAction('INTERVAL')
    countOnInterval(interval: number, increment: number = 1): Action<IncrementIntervalPayload> {
        return this.formatAction({
            interval,
            increment
        })
    }

    @Saga('INTERVAL')
    async intervalSaga(action: Action<IncrementIntervalPayload>) {
        while(true) {
            await delay(action.payload.interval);
            await put(this.increment(action.payload.increment));
        }
    }

    @Reducer('INCREMENT')
    incrementReducer(state: CounterState, action: Action<IncrementPayload>): CounterState {
        return {
            ...state,
            count: state.count + action.payload.count
        }
    }

    @Reducer('DECREMENT')
    decrementReducer(state: CounterState, action: Action<IncrementPayload>): CounterState {
        return {
            ...state,
            count: state.count - action.payload.count
        }
    }
}
