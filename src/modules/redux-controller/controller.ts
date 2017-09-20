import { bindActionCreators } from 'redux';
import { all, takeEvery, call } from 'redux-saga/effects';
import { StandardAction } from './controller.models';

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

export const GlobalReducer = (target: any, methodName: string, descriptor: PropertyDescriptor) => {
    target._reducerMap = {
        ...target._reducerMap,
        [methodName]: ['*']
    }
}

export const ReduxType = (typeName: string) => {
    return (constructor: Function) => {
        constructor.prototype._typeName = typeName;
    }
}

export const StateDefaults = <T extends Object>(defaults: T) => {
    return (constructor: Function) => {
        constructor.prototype.defaults = defaults;
    }
}

type StringableAction = string | {
    toString: () => string
};

export class ReduxController<State extends Object> {
    public namespace: string = 'GLOBAL';
    public defaults: State;
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
        if (stateDefaults) {
            this.defaults = stateDefaults;
        }
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

            const isGlobal = associatedActions.length === 1 && associatedActions[0] === '*';
            // If it's not a global reducer, replace the reducer with a filtered reducer
            if (!isGlobal) {
                const oldReducer = this[methodName]
                this[methodName] = (state: State, action: StandardAction<any>) : State => {
                    const isAssociatedAction = associatedActions.indexOf(action.type) >= 0;
                    if (isAssociatedAction) {
                        return oldReducer(state, action);
                    } else {
                        return state;
                    }
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
        return [this.formatNamespace(), actionName]
            .filter(item => typeof item === 'string' && item.length > 0)
            .join('/');
    }

    public formatNamespace() {
        return [this._typeName, this.namespace]
            .filter(item => typeof item === 'string' && item.length > 0)
            .join('/');
    }

    public createSaga(): () => IterableIterator<any> {
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

    public createReducer(defaultsOverride?: State): (state: State, action: StandardAction<any>) => State {
        const defaults = defaultsOverride || this.defaults;
        return (state: State = defaults, action: StandardAction<any>): State => {
            const globalReducers = this._reducerIndex['*'] || [];
            const localReducers = this._reducerIndex[action.type] || [];
            const relevantReducers = [...localReducers, ...globalReducers];
            if (relevantReducers) {
                return relevantReducers.reduce((nextState: State, methodName: string): State => {
                    const reducer = this[methodName];
                    const newState = reducer(nextState, action);
                    if (newState === undefined) {
                        const culprit = [this.constructor && this.constructor.name, methodName]
                            .filter(item => !!item)
                            .join('.');
                        throw new Error(`Reducer "${culprit}" in namespace ${this.formatNamespace()} returned undefined during initialization. If the state passed to the reducer is undefined, you must explicitly return the initial state. The initial state may not be undefined. If you don't want to set a value for this reducer, you can use null instead of undefined.`);
                    } else {
                        return newState;
                    }
                }, state);
            } else {
                return state;
            }
        }
    }

    public mapToDispatch(dispatch: () => any): Object {
        const actionGroup = Object.keys(this._actionCreators).reduce((actions, methodName) => {
            return {
                ...actions,
                [methodName]: this[methodName]
            }
        }, {});

        return bindActionCreators(actionGroup, dispatch)
    }

    public formatAction<T extends Object>(payload?: T, meta?: any): StandardAction<T> {
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
    public setState(newState: State): StandardAction<any> {
        return this.formatAction(newState)
    }

    @ReduxAction('RESET')
    public resetState(newDefualts: State): StandardAction<any> {
        newDefualts = newDefualts || this.defaults;
        return this.formatAction(Object.assign({}, this.defaults, newDefualts));
    }

    @Reducer('SET')
    public setReducer(state: State, action: StandardAction<any>): State {
        return Object.assign({}, state, action.payload);
    }

    @Reducer('RESET')
    public resetReducer(state: State, action: StandardAction<any>): State {
        return action.payload;
    }
}
