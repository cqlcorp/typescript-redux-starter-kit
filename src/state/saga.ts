import { all } from 'redux-saga/effects';
import { pushupSaga } from './pushups';
import { situpSaga } from './situps';

export const rootSaga = function* rootSaga() {
    console.log('root saga');
    yield all([
        pushupSaga(),
        situpSaga()
    ])
}
