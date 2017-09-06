import { CounterController } from 'counter';

export const PushupActions = new CounterController('PUSHUP');
export const pushupReducer = PushupActions.createReducer();
export const pushupSaga = PushupActions.createSaga();