import { RootState } from 'state';
import { TrackerInstance } from 'modules/redux-requests';

export const getLoadingState = (state: RootState, namespace: string) => {
    const loaderInfo: TrackerInstance = state.requests.instances[namespace];
    return loaderInfo && loaderInfo.busy;
}
