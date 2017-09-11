import { combineReducers } from 'redux';
import { CounterState } from 'counter';

import { pushupReducer } from 'state/pushups';
import { situpReducer } from 'state/situps';
import { routeReducer, RouteState } from 'state/routing';

export interface RootState {
    pushups: CounterState,
    situps: CounterState,
    currentRoute: RouteState
}

export const rootReducer = combineReducers<RootState>({
    pushups: pushupReducer,
    situps: situpReducer,
    currentRoute: routeReducer
});
