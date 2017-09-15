import * as moment from 'moment';
import { Moment } from 'moment';

export class EnvVar {
    static string(varName: string, defaultVal?: string): string | undefined {
        return process.env[varName] || defaultVal;
    }

    static number(varName: string, defaultVal?: number): number | undefined {
        const val = Number(process.env[varName]);
        return isNaN(val) ? undefined : val;
    }

    static object(varName: string, defaultVal?: Object): Object | undefined {
        const val = process.env[varName];
        try {
            return (val ? JSON.parse(val) : defaultVal) || {};
        } catch(e) {
            return undefined;
        }
    }

    static array(varName: string, defaultVal?: any[]): any[] | undefined {
        const val = process.env[varName];
        try {
            return (val ? JSON.parse(val) : defaultVal) || [];
        } catch(e) {
            return undefined;
        }
    }

    static boolean(varName: string, defaultVal?: boolean): boolean | undefined {
        let val = process.env[varName];
        return typeof val === 'boolean' ? val : defaultVal;
    }

    static date(varName: string, parseFormat: string, defaultVal?: Date | Moment): Moment | undefined {
        let val = process.env[varName];
        return (val ? moment(val, parseFormat) : moment(defaultVal));
    }
}
