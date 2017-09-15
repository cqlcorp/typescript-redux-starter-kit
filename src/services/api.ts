import axios from 'axios';
import * as qs from 'qs';
import { EnvVar } from 'modules/env-utils';

const baseHttp = axios.create({
    baseURL: EnvVar.string('API_CLIENT_PREFIX', '/api'),
    timeout: EnvVar.number('API_TIMEOUT', 5000),
    headers: {
        accepts: 'application/json'
    },
    validateStatus: status => {
        return status >= 200 && status < 300;
    },
    paramsSerializer: params => {
        return qs.stringify(params);
    }
})

export default baseHttp
