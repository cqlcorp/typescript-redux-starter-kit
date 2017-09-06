import { CounterController } from 'counter';

export const PushupActions = new CounterController('PUSHUP');
(<any>window).PushupActions = PushupActions;
export const pushupReducer = PushupActions.createReducer();
export const pushupSaga = PushupActions.createSaga();
