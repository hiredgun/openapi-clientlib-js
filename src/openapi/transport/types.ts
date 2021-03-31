export type Methods = 'get' | 'put' | 'post' | 'delete' | 'patch' | 'options' | 'head';

export type APIStatusCode = 401 | 404 | 200 | 201 | 500;

export type services = Record<string, {
    useCloud?: boolean | (() => boolean)
}>
export type Options = {
    authErrorsDebouncePeriod?: number;
    language?: string,
    services?: services,
    host?: 'string',
    timeoutMs?: number
};

