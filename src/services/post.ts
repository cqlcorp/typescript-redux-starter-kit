import { placeholderApi } from './api';

export const PostApi = {
    getAll: () => placeholderApi.get('/posts'),
    getOne: (postId: number) => placeholderApi.get(`/posts/${postId}`),
    getComments: (postId: number) => placeholderApi.get('/comments', {
        params: {
            postId
        }
    }),
    getPostsForUser: (userId: number) => placeholderApi.get('/posts', {
        params: {
            userId
        }
    })
}
