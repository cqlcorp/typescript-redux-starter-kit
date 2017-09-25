import { fork } from 'redux-saga/effects';
import { router } from 'redux-saga-router';
import { RouteController, history } from 'modules/route-utils'
import { routeSagas } from './route.saga';

export { RouteState, syncHistoryWithStore } from 'modules/route-utils';
export const RouteActions = new RouteController('ROUTER');
export const routeReducer = RouteActions.createReducer();

export const routerOptions = {
    matchAll: false
}

export const routerSaga = function*() {
    yield fork(router, history, routeSagas, routerOptions);
}
