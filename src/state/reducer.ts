import { combineReducers } from 'redux';
import { CounterState } from 'counter';
import { trackerReducer, TrackerState } from 'modules/redux-requests';

import { pushupReducer } from 'state/pushups';
import { situpReducer } from 'state/situps';
import { postReducer, Post } from 'state/posts';
import { User, userReducer } from 'state/users';
import { RouteState, routeReducer } from 'state/routing';

export interface RootState {
    pushups: CounterState,
    situps: CounterState,
    currentRoute: RouteState,
    requests: TrackerState,
    posts: Post[],
    users: User[],
}

export const rootReducer = combineReducers<RootState>({
    pushups: pushupReducer,
    situps: situpReducer,
    currentRoute: routeReducer,
    requests: trackerReducer,
    posts: postReducer,
    users: userReducer
});
