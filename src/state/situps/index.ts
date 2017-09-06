import { CounterController } from 'counter';

export const SitupActions = new CounterController('SITUP');
export const situpReducer = SitupActions.createReducer();
export const situpSaga = SitupActions.createSaga();
