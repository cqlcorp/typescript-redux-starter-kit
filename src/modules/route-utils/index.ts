import createBrowserHistory from 'history/createBrowserHistory';

export { RouteController, RouteState, RouteChangePayload, RouteError, RouteStatus } from './route.controller';

export const history = createBrowserHistory();
