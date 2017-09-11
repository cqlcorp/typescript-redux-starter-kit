import { connect } from 'react-redux';

import { SitupActions } from '../state';
import { RootState } from '../state';
import { CounterCallbacks, CounterState, Counter } from 'counter';

const select = (state: RootState): CounterState => {
    return state.situps
}

const mapDispatchToProps = (dispatch: any): CounterCallbacks => {
    return {
        onDecrement: () => dispatch(SitupActions.decrement()),
        onIncrement: () => dispatch(SitupActions.increment()),
        onSetCount: (count) => dispatch(SitupActions.setCount(count))
    }
}

export const SitupCounter = connect(select, mapDispatchToProps)(Counter)
