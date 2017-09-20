import { Action } from 'redux';
import { StandardAction } from 'modules/redux-controller';
// import { ReduxController, StandardAction, StateDefaults, GlobalReducer } from 'modules/redux-controller'
// import { RequestController } from './request.controller'
import { RequestTrackerState, RequestStartPayload, RequestFinishPayload } from './request.models'

// interface RegistrationPayload {
//     namespace: string
// }

// @StateDefaults<RequestTrackerState>({
//     defaultRequestState: {
//         busy: false,
//         error: undefined,
//         lastRequest: undefined,
//         lastResponse: undefined
//     },
//     requests: {}
// })
// export class RequestTrackerController extends ReduxController<RequestTrackerState> {
//     @GlobalReducer
//     registerReducer(state: RequestTrackerState, action: StandardAction<RegistrationPayload>) {
//         return {
//             ...state,
//             requests: {
//                 ...state.requests,
//                 [action.payload.namespace]:
//             }
//         }
//     }
// }

const defaultState: RequestTrackerState = {
    defaultRequestState: {
        busy: false,
        error: undefined,
        lastRequest: undefined,
        lastResponse: undefined
    },
    requests: {}
}

const requestActionRegex = /^REQUEST\/([^\/]*)\/([^\/]*)$/g;

export function requestReducer<Request, Response>(state: RequestTrackerState = defaultState, action: Action): RequestTrackerState {
    const match = requestActionRegex.exec(action.type);
    if (match) {
        const namespace = match[1];
        const actionType = match[2];
        let startAction = <StandardAction<RequestStartPayload<Request>>>action;
        let finishAction = <StandardAction<RequestFinishPayload<Response>>>action;
        switch (actionType) {
            case 'START':
                return {
                    ...state,
                    requests: {
                        ...state.requests,
                        [namespace]: {
                            ...(state.requests[namespace] || {}),
                            busy: true,
                            lastRequest: startAction.payload.config,
                            error: undefined
                        }
                    }
                }
            case 'FINISH':
                return {
                    ...state,
                    requests: {
                        ...state,
                        [namespace]: {
                            ...(state.requests[namespace] || {}),
                            busy: false,
                            lastResponse: finishAction.payload.response,
                            error: finishAction.payload.error
                        }
                    }
                }
        }
    }

    return state;
}
