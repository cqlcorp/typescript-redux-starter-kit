import { Action as BaseAction } from 'redux';
import { all, takeEvery } from 'redux-saga/effects';

export interface Action<PayloadType extends Object> extends BaseAction {
    type: string,
    payload: PayloadType,
    meta?: any,
    error?: any
}

export const ReduxAction = (actionName: string) => {
    return function (target: any, methodName: string, descriptor: PropertyDescriptor) {
        target._actionMap = {
            ...target._actionMap,
            [methodName]: actionName
        };
        target._actionCreators = {
            ...target._actionCreators,
            [actionName]: methodName
        };
    }
}

export const Saga = (actionName: string, effect: any = takeEvery) => {
    return (target: any, methodName: string, descriptor: PropertyDescriptor) => {
        target._sagas = {
            ...target._sagas,
            [methodName]: {
                methodName,
                effect,
                actionName
            }
        };
        if (!target._actionMap[actionName]) {
            target._creatorlessActions = {
                ...target._creatorlessActions,
                [actionName]: {
                    origin: methodName,
                    actionName
                }
            }
        }
    }
}

export const Reducer = (...actions: any[]) => {
    actions = Array.isArray(actions) ? actions : [actions];
    return (target: any, methodName: string, descriptor: PropertyDescriptor) => {
        target._reducerMap = {
            ...target._reducerMap,
            [methodName]: actions
        }
    }
}

export const ReduxType = (typeName: string) => {
    return (constructor: Function) => {
        constructor.prototype._typeName = typeName;
    }
}

type StringableAction = string | {
    toString: () => string
};

export class ReduxController<State extends Object> {
    namespace: string = 'GLOBAL';
    defaults: State | {};
    _typeName: string = '';
    _actionMap: any;
    _reducerMap: any;
    _reducerActions: any;
    _reducerIndex: any;
    _actionCreators: any;
    _creatorlessActions: any;
    _baseActionTypes: any;
    _actionTypes: any;
    _sagas: any;

    constructor(namespace: string, stateDefaults?: State) {
        this.namespace = namespace;
        this.defaults = stateDefaults || {};
        this.initActionCreators();
        this.initReducers();
        this.buildReducerIndex();
    }

    buildReducerIndex() {
        // Build an index of reducers by action name
        this._reducerIndex = this._reducerIndex || {};
        Object.keys(this._reducerActions).forEach((methodName: string) => {
            const reducerActions = this._reducerActions[methodName] || [];
            reducerActions.forEach((actionType: string) => {
                this._reducerIndex = {
                    ...this._reducerIndex,
                    [actionType]: {
                        ...this._reducerIndex[actionType],
                        [methodName]: methodName
                    }
                }
            })
        });
        // Format reducers as arrays
        Object.keys(this._reducerIndex).forEach((actionType: string) => {
            const reducers = this._reducerIndex[actionType];
            this._reducerIndex = {
                ...this._reducerIndex,
                [actionType]: Object.keys(reducers)
            }
        });
    }

    initReducers() {
        this._reducerMap = this._reducerMap || {};
        Object.keys(this._reducerMap).forEach((methodName: string) => {
            const associatedActions = this._reducerMap[methodName].map((action: StringableAction ) => {
                let actionType = action + '';
                // If we're dealing with a local action
                if (this._baseActionTypes[actionType] || this._creatorlessActions[actionType]) {
                    actionType = this.formatActionName(actionType);
                }
                
                return actionType;
            });

            this._reducerActions = {
                ...this._reducerActions,
                [methodName]: associatedActions || []
            }

            const oldReducer = this[methodName]
            this[methodName] = (state: State, action: Action<any>) : State => {
                if (associatedActions.indexOf(action.type) >= 0) {
                    return oldReducer(state, action);
                } else {
                    return state;
                }
            }
        })
    }

    initActionCreators() {
        this._actionMap = this._actionMap || {};
        Object.keys(this._actionMap).forEach((methodName: string) => {
            const actionType = this._actionMap[methodName];
            this._baseActionTypes = {
                ...this._baseActionTypes,
                [actionType]: actionType
            }
            this._actionTypes = {
                ...this._actionTypes,
                [actionType]: this.formatActionName(actionType)
            }
            const method = this[methodName];
            this[methodName] = (...args: any[]) => ({
                type: this.formatActionName(actionType),
                ...(method(...args) || {})
            });
            this[methodName].toString = () => this.formatActionName(actionType);
        })
    }

    formatActionName(actionName: string): string {
        return [this._typeName, this.namespace, actionName].join('/');
    }

    createSaga() {
        return async () => {
            const sagas = Object.keys(this._sagas).map((methodName: string) => {
                const sagaInfo = this._sagas[methodName];
                const context = this;
                return function*() {
                    yield sagaInfo.effect(context.formatActionName(sagaInfo.actionName), context[sagaInfo.methodName]);
                }
            });
            return async () => {
                await all(sagas);
            }
        }
    }

    createReducer(defaultsOverride?: State) {
        const defaults = Object.assign({}, this.defaults, defaultsOverride) as State;
        return (state: State = defaults, action: Action<any>) => {
            const relevantReducers = this._reducerIndex[action.type];
            return relevantReducers.reduce((nextState: State, methodName: string): State => {
                const reducer = this[methodName];
                return reducer(nextState, action);
            }, state);
        }
    }

    formatAction<T extends Object>(payload?: T, meta?: any): Action<T> {
        if (!payload) {
            payload = {} as T;
        }

        return {
            type: '',
            payload: payload,
            meta
        }
    }

    // Base Actions

    @ReduxAction('SET')
    setState(newState: State): Action<any> {
        return this.formatAction(newState)
    }

    @ReduxAction('RESET')
    resetState(newDefualts: State) {
        newDefualts = newDefualts || this.defaults;
        return this.formatAction(Object.assign({}, this.defaults, newDefualts));
    }

    @Reducer('SET')
    setReducer(state: State, action: Action<any>): State {
        return Object.assign({}, state, action.payload);
    }

    @Reducer('RESET')
    resetReducer(state: State, action: Action<any>): State {
        return action.payload;
    }
}