import { connect } from 'react-redux';

import { PushupActions } from '../state';
import { RootState } from '../state';
import { CounterCallbacks, CounterState, Counter } from 'counter';

const select = (state: RootState): CounterState => {
    return state.pushups
}

const mapDispatchToProps = (dispatch: any): CounterCallbacks => {
    return {
        onDecrement: () => dispatch(PushupActions.decrement()),
        onIncrement: () => dispatch(PushupActions.increment())
    }
}

export const PushupCounter = connect(select, mapDispatchToProps)(Counter)
