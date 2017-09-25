import { History } from 'history';
import { Store } from 'redux';

import { RouteController } from './route.controller';
export { RouteController, RouteState, RouteChangePayload } from './route.controller';
export { history } from './history';

export const syncHistoryWithStore = (history: History, controller: RouteController, store: Store<any>) => {
    history.listen((location, action) => {
        store.dispatch(controller.routeChangeDetected(location));
    })
}
