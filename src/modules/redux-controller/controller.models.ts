import { Action as BaseAction } from 'redux';

export interface StandardAction<PayloadType extends Object> extends BaseAction {
    type: string,
    payload: PayloadType,
    meta?: any,
    error?: any
}

export interface ReduxControllerInstance<S> {
    namespace: string,
    defaults: S,
    formatActionName: (actionType: string) => string,
    formatNamespace: () => string,
    createSaga(): () => IterableIterator<any>,
    createReducer(defaultsOverride?: S): (state: S, action: StandardAction<any>) => S,
    mapToDispatch(dispatch: () => any): Object,
    formatAction<T extends Object>(payload?: T, meta?: any): StandardAction<T>,
    setState(newState: S): StandardAction<any>,
    resetState(newDefualts: S): StandardAction<any>,
    setReducer(state: S, action: StandardAction<any>): S,
    resetReducer(state: S, action: StandardAction<any>): S,
}
