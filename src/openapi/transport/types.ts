import type { StringTemplateArgs } from '../../utils/string';

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

export interface TransportCoreOptions {
    headers?: Record<string, string>;
    queryParams?: Record<string, string | number>;
    body?: string | Record<string, unknown> | URLSearchParams | File | FormData;
    cache?: boolean;
    requestId?: string;
}

// eslint-disable-next-line max-len
export type HTTPMethodInputArgs = [string | undefined, string | undefined, StringTemplateArgs | undefined, TransportCoreOptions | undefined];
