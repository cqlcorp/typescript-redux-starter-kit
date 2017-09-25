import { Location } from 'history';
import { ReduxController, StateDefaults, ReduxAction, StandardAction, Reducer } from 'modules/redux-controller';
import { history } from './history';

export interface RouteError {
    message: string
}

export interface RouteState {
    currentRoute: string,
    currentLocation: Location | null
}

export interface RouteChangePayload {
    route: string,
    location: Location
}

@StateDefaults<RouteState>({
    currentRoute: history.location.pathname,
    currentLocation: null,
})
export class RouteController extends ReduxController<RouteState> {

    @ReduxAction('ROUTE_CHANGE')
    routeChangeDetected(newLocation: Location): StandardAction<RouteChangePayload> {
        return this.formatAction({
            route: newLocation.pathname,
            location: newLocation,
        })
    }

    @Reducer('ROUTE_CHANGE')
    routeReducer(state: RouteState, action: StandardAction<RouteChangePayload>): RouteState {
        return {
            ...state,
            currentRoute: action.payload.route,
            currentLocation: action.payload.location
        }
    }
}
