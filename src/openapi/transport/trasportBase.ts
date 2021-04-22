import type {
    HTTPMethodSuccessResult,
    HTTPMethods,
    TransportCoreOptions,
} from './types';
import type { StringTemplateArgs } from '../../utils/string';

type MethodReturn = (
    servicePath?: string,
    urlTemplate?: string,
    templateArgs?: StringTemplateArgs,
    options?: TransportCoreOptions,
) => Promise<HTTPMethodSuccessResult>;

export interface ITransport {
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

    abstract prepareTransportMethod(
        method: HTTPMethods,
    ): (
        servicePath?: string,
        urlTemplate?: string,
        templateArgs?: StringTemplateArgs,
        options?: TransportCoreOptions,
    ) => Promise<HTTPMethodSuccessResult>;

    get = this.prepareTransportMethod('get');
    post = this.prepareTransportMethod('post');
    put = this.prepareTransportMethod('put');
    delete = this.prepareTransportMethod('delete');
    patch = this.prepareTransportMethod('patch');
    head = this.prepareTransportMethod('head');
    options = this.prepareTransportMethod('options');
}

export default TransportBase;
