import { put } from 'redux-saga/effects';
import { Action } from 'redux';

export type Yieldable<Result> = () => IterableIterator<Result> | Promise<Result>;

export interface TrackerAction extends Action {
    namespace: string,
    error?: Object
}

export interface TrackerInstance {
    busy: boolean,
    error?: Object | undefined
}

export interface TrackerState {
    defaultState: TrackerInstance,
    instances: Object
}

const defaultState: TrackerState = {
    defaultState: {
        busy: false,
        error: undefined
    },
    instances: {}
}

const actionTypes = {
    START: 'TRACKER/START',
    FINISH: 'TRACKER/FINISH',
    ERROR: 'TRACKER/ERROR'
}

export const TrackerActions = {
    startProgress: (namespace: string): TrackerAction => ({
        type: actionTypes.START,
        namespace
    }),
    finishProgress: (namespace: string): TrackerAction => ({
        type: actionTypes.FINISH,
        namespace
    }),
    error: (namespace: string): TrackerAction => ({
        type: actionTypes.ERROR,
        namespace
    })
}

export const trackProgress = function<T>(process: Yieldable<T>, namespace: string) {
    return function*() {
        try {
            yield put(TrackerActions.startProgress(namespace));
            const result = yield process();
            yield put(TrackerActions.finishProgress(namespace));
            return result;
        } catch (e) {
            yield put(TrackerActions.error(namespace));
        }
    }
}

const updateInstance = (state: TrackerState, instance: TrackerInstance, namespace: string): TrackerState => {
    return {
        ...state,
        instances: {
            ...state.instances,
            [namespace]: instance
        }
    }
}

export const trackerReducer = function(state: TrackerState = defaultState, action: TrackerAction): TrackerState {
    switch(action.type) {
        case actionTypes.START:
            return updateInstance(state, {
                busy: true,
                error: undefined
            }, action.namespace);
        case actionTypes.FINISH:
            return updateInstance(state, {
                busy: false,
                error: undefined
            }, action.namespace);
        case actionTypes.ERROR:
            return updateInstance(state, {
                busy: false,
                error: action.error
            }, action.namespace);
    }

    return state;
}
