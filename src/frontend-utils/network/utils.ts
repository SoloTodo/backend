import { apiSettings } from '../settings';

type FetchJsonHeaders = {
    'Content-Type'?: string|null,
    'Accept'?: string,
    'Authorization'?: string
}

export type FetchJsonInit = {
    headers?: FetchJsonHeaders,
    method?: string,
    body?: string
}

export async function fetchJson(input: string, init?: FetchJsonInit): Promise<any> {
    if (!input.includes(apiSettings.endpoint)) {
        input = apiSettings.endpoint + input
    }

    const requestInit = init || {} as FetchJsonInit
    if (!requestInit.headers) {
        requestInit.headers = {}
    }

    if (requestInit.headers['Content-Type'] === null) {
        delete requestInit.headers['Content-Type']
    } else if (typeof (requestInit.headers['Content-Type'] === 'undefined')) {
        requestInit.headers['Content-Type'] = 'application/json';
    }

    requestInit.headers['Accept'] = 'application/json';

    const res = await fetch(input, requestInit as RequestInit);
    if (!res.ok) {
        throw res;
    }
    if (res.status === 204) {
        return res;
    } else {
        return res.json();
    }
}

export class InvalidTokenError extends Error {}
