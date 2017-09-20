import { ListController } from 'modules/redux-controller';

export const PostActions = new ListController('POST');
export const postReducer = PostActions.createReducer([]);

export {
    loadPostRoute
} from './post.saga';

export {
    Post
} from './post.models'
