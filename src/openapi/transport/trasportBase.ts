import type { Methods, TransportCoreOptions } from './types';

type MethodReturn = (
    servicePath?: string,
    urlTemplate?: string,
    templateArgs?: Record<string, string | number> | null,
    options?: TransportCoreOptions,
) => Promise<
    | {
          response?: string | Blob;
          status: number;
          headers: {
              get: (key: string) => string;
          };
          size: number;
          url: string;
          responseType?: string;
          isNetworkError?: boolean;
      }
    | void
    | unknown
>;

export interface ITransport {
    prepareFunction: (arg0: Methods) => MethodReturn;
    dispose: () => void;
    get: MethodReturn;
    post: MethodReturn;
    put: MethodReturn;
    delete: MethodReturn;
    patch: MethodReturn;
    head: MethodReturn;
    options: MethodReturn;
}

abstract class TransportBase implements ITransport {
    abstract dispose(): void;

    abstract prepareFunction(
        method: Methods,
    ): (
        servicePath?: string,
        urlTemplate?: string,
        templateArgs?: Record<string, string | number> | null,
        options?: TransportCoreOptions,
    ) => Promise<
        | {
              response?: string | Blob;
              status: number;
              headers: {
                  get: (key: string) => string;
              };
              size: number;
              url: string;
              responseType?: string;
              isNetworkError?: boolean;
          }
        | void
        | unknown
    >;

    get = this.prepareFunction('get');
    post = this.prepareFunction('post');
    put = this.prepareFunction('put');
    delete = this.prepareFunction('delete');
    patch = this.prepareFunction('patch');
    head = this.prepareFunction('head');
    options = this.prepareFunction('options');
}

export default TransportBase;
