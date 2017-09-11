import { Location } from 'history';
import { ReduxController, StateDefaults, ReduxAction, Action, Reducer } from 'modules/redux-controller';

export interface RouteError {
    message: string
}

export interface RouteState {
    currentRoute: string,
    currentLocation: Location | null,
    routeStatus: RouteStatus,
    routeError?: RouteError,
    routeBusy: boolean
}

export interface RouteChangePayload {
    route: string,
    location: Location
}

export enum RouteStatus {
    EMPTY = 'EMPTY',
    RESOLVING = 'RESOLVING',
    ERROR = 'ERROR',
    READY = 'READY'
}

@StateDefaults<RouteState>({
    currentRoute: '/',
    currentLocation: null,
    routeStatus: RouteStatus.EMPTY,
    routeError: undefined,
    routeBusy: false
})
export class RouteController extends ReduxController<RouteState> {

    @ReduxAction('ROUTE_CHANGE')
    routeChangeDetected(newLocation: Location): Action<RouteChangePayload> {
        return this.formatAction({
            route: newLocation.pathname,
            location: newLocation,
        })
    }

    @ReduxAction('ROUTE_LOAD')
    load(): Action<any> {
        return this.formatAction();
    }

    @ReduxAction('ROUTE_RESOLVE')
    routeResolve(): Action<any> {
        return this.formatAction();
    }

    @ReduxAction('ROUTE_ERROR')
    routeError(e: RouteError): Action<RouteError> {
        return this.formatAction<RouteError>(e);
    }

    @Reducer('ROUTE_CHANGE')
    routeReducer(state: RouteState, action: Action<RouteChangePayload>): RouteState {
        return {
            ...state,
            currentRoute: action.payload.route,
            currentLocation: action.payload.location,
            routeStatus: RouteStatus.EMPTY,
            routeError: undefined,
            routeBusy: false
        }
    }

    routeLoadReducer(state: RouteState, action: Action<any>): RouteState {
        return {
            ...state,
            routeBusy: true,
            routeStatus: RouteStatus.RESOLVING,
            routeError: undefined
        }
    }

    @Reducer('ROUTE_RESOLVE')
    routeResolveReducer(state: RouteState, action: Action<any>): RouteState {
        return {
            ...state,
            routeStatus: RouteStatus.READY,
            routeError: undefined,
            routeBusy: false
        }
    }

    @Reducer('ROUTE_ERROR')
    routeErrorReducer(state: RouteState, action: Action<RouteError>): RouteState {
        return {
            ...state,
            routeError: action.payload,
            routeStatus: RouteStatus.ERROR,
            routeBusy: false
        }
    }
}
