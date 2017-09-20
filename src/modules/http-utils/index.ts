import { EnvVar } from 'modules/env-utils'
import { AxiosRequestConfig } from 'axios';
import * as qs from 'qs';

//Utility function that converts standard urls to use the .json url
//Ergast requires to recieve a json response
export const jsonURL = (req: string): string => {
    var url = '';
    if(req.indexOf('?') !== -1) {
        let splitUrl = req.split('?')
        url = `${splitUrl[0]}.json?${splitUrl[1]}`;
    } else {
        url = `${req}.json`;
    }
    return url;
}

/**
 * Generate axios args based on typical defaults and environment variables.
 */
export const createDefaultAxiosArgs = (): AxiosRequestConfig => ({
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
