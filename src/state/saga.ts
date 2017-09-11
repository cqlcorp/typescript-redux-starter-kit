import { all } from 'redux-saga/effects';
import { pushupSaga } from './pushups';
import { situpSaga } from './situps';
import { routerSaga } from 'state/routing';

export const rootSaga = function* rootSaga() {
    yield all([
        pushupSaga(),
        situpSaga(),
        routerSaga(),
    ])
}
