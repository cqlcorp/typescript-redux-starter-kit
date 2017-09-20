import { delay } from 'redux-saga';
import { put, all } from 'redux-saga/effects';
import { PostApi } from 'services/post';
import { UserApi } from 'services/user';
import { UserActions } from 'state/users';
import { PostActions } from 'state/posts';

export const loadPostRoute = function*() {
    yield delay(500);
    const [postResponse, userResponse] = yield all([PostApi.getAll(), UserApi.getAll()]);
    yield put(PostActions.setState(postResponse.data));
    yield put(UserActions.setState(userResponse.data));
}
