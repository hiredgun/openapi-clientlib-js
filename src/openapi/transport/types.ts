export type Methods = 'get' | 'put' | 'post' | 'delete' | 'patch' | 'options' | 'head';
export type HTTPMethods = 'GET' | 'PUT' | 'POST' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';

export type APIStatusCode = 401 | 404 | 200 | 201 | 500;

export type UseCloud = {
    useCloud: boolean | string | (() => boolean | string);
};

export type Services = {
    [k in string]: UseCloud;
};
export interface Options {
    authErrorsDebouncePeriod?: number;
    language?: string;
    services?: Services;
    host?: 'string';
    timeoutMs?: number;
    defaultCache?: boolean;
}

export interface APIResponse {
    response: string;
    headers?: {
        get: (key: string) => string;
    };
    isNetworkError?: boolean;
    status?: number;
}

export interface TransportCoreOptions {
    headers?: Record<string, string | number | boolean>;
    queryParams?: Record<string, string | number>;
    body?: string | Record<string, string | number | boolean> | URLSearchParams | File | FormData;
    cache?: boolean;
    requestId?: string;
}
