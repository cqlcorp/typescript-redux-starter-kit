import { CounterController } from 'counter';

export const SitupActions = new CounterController('PUSHUP');
export const situpReducer = SitupActions.createReducer();
export const situpSaga = SitupActions.createSaga();
