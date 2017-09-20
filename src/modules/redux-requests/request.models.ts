export interface RequestState<Request, Response> {
    busy: boolean,
    error: Object | undefined,
    lastResponse: Response | undefined,
    lastRequest: Request | undefined
}

export interface RequestTrackerState {
    defaultRequestState: RequestState<any, any>,
    requests: Object
}

export interface RequestStartPayload<Request> {
    config?: Request
}

export interface RequestFinishPayload<Response> {
    response: Response,
    error?: Object
}
