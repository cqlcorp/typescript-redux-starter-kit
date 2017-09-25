import { delay } from 'redux-saga';
import { put, takeEvery, take, cancel, fork } from 'redux-saga/effects';
import { ReduxController, ReduxAction, Reducer, StandardAction, Saga, StateDefaults } from 'redux-controller';
import { IncrementIntervalPayload, IncrementPayload, CounterState } from './counter.models';

@StateDefaults<CounterState>({
    count: 0
})
export class CounterController extends ReduxController<CounterState> {

    @ReduxAction('INCREMENT')
    increment(count: number = 1): StandardAction<IncrementPayload> {
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

    @ReduxAction('SET_COUNT')
    setCount(count: number) {
        return this.formatAction({
            count
        })
    }

    @ReduxAction('INTERVAL')
    countOnInterval(interval: number, increment: number = 1): StandardAction<IncrementIntervalPayload> {
        return this.formatAction({
            interval,
            increment
        })
    }

    @ReduxAction('STOP_INTERVAL')
    stopInterval() {
        return this.formatAction()
    }

    @Saga('INTERVAL', takeEvery)
    *intervalSaga(action: StandardAction<IncrementIntervalPayload>) {
        const interval = yield fork([this, this.startInterval], action);
        yield take(this.formatActionName('STOP_INTERVAL'));
        yield cancel(interval);
    }

    *startInterval(action: StandardAction<IncrementIntervalPayload>) {
        while(true) {
            yield delay(action.payload.interval);
            yield put(this.increment(action.payload.increment));
        }
    }

    @Reducer('SET_COUNT')
    setCountReducer(state: CounterState, action: StandardAction<IncrementPayload>): CounterState {
        const count = isNaN(action.payload.count) ? 0 : action.payload.count;
        return {
            ...state,
            count
        }
    }

    @Reducer('INCREMENT')
    incrementReducer(state: CounterState, action: StandardAction<IncrementPayload>): CounterState {
        return {
            ...state,
            count: state.count + action.payload.count
        }
    }

    @Reducer('DECREMENT')
    decrementReducer(state: CounterState, action: StandardAction<IncrementPayload>): CounterState {
        return {
            ...state,
            count: state.count - action.payload.count
        }
    }
}
