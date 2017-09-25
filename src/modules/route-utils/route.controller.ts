import { Location } from 'history';
import * as qs from 'qs';
import { ReduxController, StateDefaults, ReduxAction, StandardAction, Reducer } from 'modules/redux-controller';
import { history } from './history';

export interface RouteError {
    message: string
}

export interface RouteState {
    currentRoute: string,
    params: Object,
    hash: string,
    search: string,
    url: string
}

export interface RouteChangePayload {
    route: string,
    location: Location
}

export function parseRouteState(location: Location): RouteState {
    return {
        currentRoute: location.pathname,
        params: qs.parse(location.search.replace(/^\?/, '')),
        hash: location.hash,
        search: location.search,
        url: history.createHref(location)
    }
}

@StateDefaults<RouteState>(parseRouteState(history.location))
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
            ...parseRouteState(action.payload.location)
        }
    }
}
