import { put, fork } from 'redux-saga/effects';
import { router } from 'redux-saga-router';

// import { routes } from 'constants/routes';
import { RouteController, history } from 'modules/route-utils'
export { RouteState } from 'modules/route-utils';

export const RouteActions = new RouteController('ROUTER');
export const routeReducer = RouteActions.createReducer();

export const routerOptions = {
    matchAll: false,
    *beforeRouteChange() {
        yield put(RouteActions.routeChangeDetected(history.location));
    }
}

export const routeSagas = {
    '*': function*() {
        yield put(RouteActions.routeResolve());
    }
}

export const routerSaga = function*() {
    yield fork(router, history, routeSagas, routerOptions);
}
