import { put } from 'redux-saga/effects';
import { RequestState, RequestStartPayload, RequestFinishPayload } from './request.models'
import { ReduxController, StandardAction, ReduxAction, ReduxType } from 'modules/redux-controller';

@ReduxType('REQUEST')
export class RequestController<Request, Response> extends ReduxController<RequestState<Request, Response>> {

    *trackRequest(request: Promise<any>) {
        yield put(this.start());
        const response = yield request;
        yield put(this.finish(response));
        return response;
    }

    @ReduxAction('START')
    start(config?: Request): StandardAction<RequestStartPayload<Request>> {
        return this.formatAction({
            config
        })
    }

    @ReduxAction('FINISH')
    finish(response: Response, error?: Object): StandardAction<RequestFinishPayload<Response>> {
        return this.formatAction({
            response,
            error
        })
    }
}
