import axios from 'axios';
import { extendProvider } from 'modules/middleman';
import { axiosSagaMiddleware } from 'modules/axios-middleware';
import { createDefaultAxiosArgs } from 'modules/http-utils';

// Standard API
const baseHttp = axios.create({
    ...createDefaultAxiosArgs()
    // Any project-specific overrides go here
})

// You can add any middleware here
export const api = extendProvider(baseHttp).applyMiddleware(axiosSagaMiddleware);

// Placeholder API for testing
const basePlaceholderApi = axios.create({
    ...createDefaultAxiosArgs(),
    baseURL: 'https://jsonplaceholder.typicode.com'
})

// You can add any middleware here
export const placeholderApi = extendProvider(basePlaceholderApi).applyMiddleware(axiosSagaMiddleware);
