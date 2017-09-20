import { Location } from 'history';
import { ReduxController, StateDefaults, ReduxAction, StandardAction, Reducer } from 'modules/redux-controller';

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
    routeChangeDetected(newLocation: Location): StandardAction<RouteChangePayload> {
        return this.formatAction({
            route: newLocation.pathname,
            location: newLocation,
        })
    }

    @ReduxAction('ROUTE_LOAD')
    load(): StandardAction<any> {
        return this.formatAction();
    }

    @ReduxAction('ROUTE_RESOLVE')
    routeResolve(): StandardAction<any> {
        return this.formatAction();
    }

    @ReduxAction('ROUTE_ERROR')
    routeError(e: RouteError): StandardAction<RouteError> {
        return this.formatAction<RouteError>(e);
    }

    @Reducer('ROUTE_CHANGE')
    routeReducer(state: RouteState, action: StandardAction<RouteChangePayload>): RouteState {
        return {
            ...state,
            currentRoute: action.payload.route,
            currentLocation: action.payload.location,
            routeStatus: RouteStatus.EMPTY,
            routeError: undefined,
            routeBusy: false
        }
    }

    routeLoadReducer(state: RouteState, action: StandardAction<any>): RouteState {
        return {
            ...state,
            routeBusy: true,
            routeStatus: RouteStatus.RESOLVING,
            routeError: undefined
        }
    }

    @Reducer('ROUTE_RESOLVE')
    routeResolveReducer(state: RouteState, action: StandardAction<any>): RouteState {
        return {
            ...state,
            routeStatus: RouteStatus.READY,
            routeError: undefined,
            routeBusy: false
        }
    }

    @Reducer('ROUTE_ERROR')
    routeErrorReducer(state: RouteState, action: StandardAction<RouteError>): RouteState {
        return {
            ...state,
            routeError: action.payload,
            routeStatus: RouteStatus.ERROR,
            routeBusy: false
        }
    }
}
