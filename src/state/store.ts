declare var window: Window & { devToolsExtension: any, __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any };
import { createStore, compose, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'

import { rootReducer, RootState } from './reducer'
import { rootSaga } from './saga'

import { RouteActions } from 'state/routing';
import { history } from 'modules/route-utils';
import { syncHistoryWithStore } from 'modules/route-utils';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const sagaMiddleware = createSagaMiddleware();

const enhancer = composeEnhancers(
    applyMiddleware(sagaMiddleware)
)

const store = createStore<RootState>(
    rootReducer,
    {} as RootState,
    enhancer
)

sagaMiddleware.run(rootSaga);
syncHistoryWithStore(history, RouteActions, store);

export default store;
