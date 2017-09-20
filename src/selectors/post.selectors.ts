import { createSelector } from 'reselect';

import { RootState } from 'state';
import { User } from 'state/users';
import { BlogPost } from 'models';

export const posts = (state: RootState) => state.posts;
export const users = (state: RootState) => state.users;

function getUserForId(users: User[], userId: number) {
    for (var i = 0; i < users.length; i++) {
        const user = users[i];
        if (user.id === userId) {
            return user;
        }
    }
    return undefined;
}

export const getBlogPosts = createSelector(
    [posts, users],
    (posts, users): BlogPost[] => {
        return posts.map((post): BlogPost => {
            const user = getUserForId(users, post.userId);
            return {
                ...post,
                author: user
            }
        })
    }
)
