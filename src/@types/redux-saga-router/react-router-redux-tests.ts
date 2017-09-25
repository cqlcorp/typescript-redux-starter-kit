import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createBrowserHistory } from 'history';
import {
    routerReducer,
    routerMiddleware,
    push,
    replace,
    go,
    goForward,
    goBack,
    routerActions
} from 'react-router-redux';

const reducer = combineReducers({ routing: routerReducer });

// Apply the middleware to the store
const history = createBrowserHistory();
const middleware = routerMiddleware(history);
const store = createStore(
    reducer,
    applyMiddleware(middleware)
);

// Create an enhanced history that syncs navigation events with the store
history.listen(location => console.log(location));

// Dispatch from anywhere like normal.
store.dispatch(push('/foo'));
store.dispatch(replace('/foo'));
store.dispatch(go(1));
store.dispatch(goForward());
store.dispatch(goBack());
store.dispatch(routerActions.push('/foo'));
store.dispatch(routerActions.replace('/foo'));
store.dispatch(routerActions.go(1));
store.dispatch(routerActions.goForward());
store.dispatch(routerActions.goBack());
