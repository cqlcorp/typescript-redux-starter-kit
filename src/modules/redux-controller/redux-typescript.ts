import { Action as BaseAction, bindActionCreators } from 'redux';
import { all, takeEvery, call } from 'redux-saga/effects';

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

export const StateDefaults = <T extends Object>(defaults: T) => {
    return (constructor: Function) => {
        constructor.prototype._baseDefaults = defaults;
    }
}

type StringableAction = string | {
    toString: () => string
};

export class ReduxController<State extends Object> {
    public namespace: string = 'GLOBAL';
    public defaults: State | {};
    private _baseDefaults: State;
    private _typeName: string;
    private _actionMap: any;
    private _reducerMap: any;
    private _reducerActions: any;
    private _reducerIndex: any;
    private _actionCreators: any;
    private _creatorlessActions: any;
    private _baseActionTypes: any;
    private _actionTypes: any;
    private _sagas: any;

    constructor(namespace: string, stateDefaults?: State) {
        this.namespace = namespace;
        this.defaults = Object.assign({}, this._baseDefaults, stateDefaults);
        this.initActionCreators();
        this.initReducers();
        this.buildReducerIndex();
    }

    private buildReducerIndex() {
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

    private initReducers() {
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

    private initActionCreators() {
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
            const context = this;
            this[methodName] = (...args: any[]) => {
                const result = method.apply(context, args);
                const actionName = context.formatActionName(actionType);
                return {
                    ...result,
                    type: actionName
                }
            };
            this[methodName].toString = () => this.formatActionName(actionType);
        })
    }

    public formatActionName(actionName: string): string {
        return [this._typeName, this.namespace, actionName]
            .filter(item => typeof item === 'string' && item.length > 0)
            .join('/');
    }

    public createSaga() {
        const sagas = Object.keys(this._sagas).map((methodName: string) => {
            const sagaInfo = this._sagas[methodName];
            const context = this;
            const actionName = context.formatActionName(sagaInfo.actionName);
            return function*() {
                yield sagaInfo.effect(actionName, function*(...actionArgs: any[]) {
                    yield context[sagaInfo.methodName].apply(context, actionArgs);
                });
            }
        });
        return function*() {
            yield all(sagas.map(saga => call(saga)));
        }
    }

    public createReducer(defaultsOverride?: State) {
        const defaults = Object.assign({}, this.defaults, defaultsOverride) as State;
        return (state: State = defaults, action: Action<any>): State => {
            const relevantReducers = this._reducerIndex[action.type];
            if (relevantReducers) {
                return relevantReducers.reduce((nextState: State, methodName: string): State => {
                    const reducer = this[methodName];
                    return reducer(nextState, action);
                }, state);
            } else {
                return state;
            }
        }
    }

    public mapToDispatch(dispatch: () => any) {
        const actionGroup = Object.keys(this._actionCreators).reduce((actions, methodName) => {
            return {
                ...actions,
                [methodName]: this[methodName]
            }
        }, {});

        return bindActionCreators(actionGroup, dispatch)
    }

    public formatAction<T extends Object>(payload?: T, meta?: any): Action<T> {
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
    public setState(newState: State): Action<any> {
        return this.formatAction(newState)
    }

    @ReduxAction('RESET')
    public resetState(newDefualts: State): Action<any> {
        newDefualts = newDefualts || this.defaults;
        return this.formatAction(Object.assign({}, this.defaults, newDefualts));
    }

    @Reducer('SET')
    public setReducer(state: State, action: Action<any>): State {
        return Object.assign({}, state, action.payload);
    }

    @Reducer('RESET')
    public resetReducer(state: State, action: Action<any>): State {
        return action.payload;
    }
}
