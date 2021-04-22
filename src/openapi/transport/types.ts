import type { StringTemplateArgs } from '../../utils/string';

export type HTTPMethodType = 'get' | 'put' | 'post' | 'delete' | 'patch' | 'options' | 'head';

export type HTTPStatusCode = 401 | 404 | 200 | 201 | 500;

export type UseCloud = {
    useCloud?: boolean | string | (() => boolean | string);
};

export type Services = {
    [k in string]: UseCloud;
};
export interface TransportOptions {
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
    headers?: Record<string, string>;
    queryParams?: Record<string, string | number>;
    body?: string | Record<string, unknown> | URLSearchParams | File | FormData;
    cache?: boolean;
    requestId?: string;
}

// eslint-disable-next-line max-len
export type HTTPMethodInputArgs = [string | undefined, string | undefined, StringTemplateArgs | undefined, TransportCoreOptions | undefined];

export interface OAPICallResult {
    response?: string | Blob | Record<string, unknown>;
    status: number;
    headers: Headers;
    size: number;
    url: string;
    responseType?: string;
    isNetworkError?: never;
}

export interface NetworkFailure {
    message?: string | Error;
    isNetworkError: true;
    status?: never;
}
