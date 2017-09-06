import { combineReducers } from 'redux';
import { CounterState } from 'counter';

import { pushupReducer } from './pushups';
import { situpReducer } from './situps';

export interface RootState {
    pushups: CounterState,
    situps: CounterState
}

export const rootReducer = combineReducers<RootState>({
    pushups: pushupReducer,
    situps: situpReducer
});