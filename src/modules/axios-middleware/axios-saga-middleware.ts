import axios from 'axios';
import { AxiosInstance, AxiosRequestConfig, CancelTokenSource, AxiosPromise } from 'axios';
import { CANCEL } from 'redux-saga';

//This axios middlware wraps an axios instance
//and sets up cancellation in the context of sagas (where all network requests should occur in this application)
//as well as throttling mechinism to respect the api guidlines for Ergast

export interface SagaRequestConfig {
    ignoreSagaCancel?: boolean
}

type NonDataRequestGenerator = (url: string, config?: SagaRequestConfig & AxiosRequestConfig) => AxiosPromise;
type DataRequestGenerator = (url: string, data?: any, config?: SagaRequestConfig & AxiosRequestConfig) => AxiosPromise;
type GenericRequestGenerator = (request: AxiosRequestConfig) => AxiosPromise;

function addCancelTokenArgs(source: CancelTokenSource, args?: AxiosRequestConfig & SagaRequestConfig) {
    const newArgs: AxiosRequestConfig & SagaRequestConfig = {
        ...args,
        cancelToken: source.token
    }
    return newArgs;
}

function attachCancelCallback(request: AxiosPromise, source: CancelTokenSource, config?: AxiosRequestConfig & SagaRequestConfig) {
    if (!config || !config.ignoreSagaCancel) {
        request[CANCEL] = () => source.cancel();
    }
    return request;
}

function wrapNonDataRequest(original: NonDataRequestGenerator) {
    return (url: string, config?: SagaRequestConfig & AxiosRequestConfig) => {
        const source = axios.CancelToken.source();
        let request = original(url, addCancelTokenArgs(source, config));
        request = attachCancelCallback(request, source, config);
        return request;
    }
}

function wrapDataRequest(original: DataRequestGenerator) {
    return (url: string, data?: any, config?: SagaRequestConfig & AxiosRequestConfig) => {
        const source = axios.CancelToken.source();
        let request = original(url, data, addCancelTokenArgs(source, config));
        request = attachCancelCallback(request, source, config);
        return request;
    }
}

function wrapGenericRequest(original: GenericRequestGenerator) {
    return (config: AxiosRequestConfig & SagaRequestConfig) => {
        const source = axios.CancelToken.source();
        let request = original(addCancelTokenArgs(source, config));
        request = attachCancelCallback(request, source, config);
        return request;
    }
}

export function axiosSagaMiddleware(httpProvider: AxiosInstance): AxiosInstance {
    return {
        ...httpProvider,
        get: wrapNonDataRequest(httpProvider.get),
        delete: wrapNonDataRequest(httpProvider.delete),
        head: wrapNonDataRequest(httpProvider.head),
        post: wrapDataRequest(httpProvider.post),
        put: wrapDataRequest(httpProvider.put),
        patch: wrapDataRequest(httpProvider.patch),
        request: wrapGenericRequest(httpProvider.request)
    }
}
