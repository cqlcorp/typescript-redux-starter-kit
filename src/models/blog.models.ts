import { Post } from 'state/posts';
import { User } from 'state/users';

//TODO: move this
export interface BlogPost extends Post {
    author: User | undefined
}

export type BlogRoll = BlogPost[];
