import { ListController } from 'modules/redux-controller';

export const UserActions = new ListController('USER');
export const userReducer = UserActions.createReducer([]);

export {
    User
} from './user.models'
