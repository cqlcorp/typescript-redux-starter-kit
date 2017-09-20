import { placeholderApi } from './api';

export const UserApi = {
    getAll: () => placeholderApi.get('/users'),
    getOne: (userId: number) => placeholderApi.get(`/users/${userId}`)
}
