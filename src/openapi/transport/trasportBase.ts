import type {
    OAPICallResult,
    HTTPMethodType,
    TransportCoreOptions,
} from './types';
import type { StringTemplateArgs } from '../../utils/string';

type HTTPMethod = (
    servicePath?: string,
    urlTemplate?: string,
    templateArgs?: StringTemplateArgs,
    options?: TransportCoreOptions,
) => Promise<OAPICallResult>;

export interface ITransport {
    dispose: () => void;
    get: HTTPMethod;
    post: HTTPMethod;
    put: HTTPMethod;
    delete: HTTPMethod;
    patch: HTTPMethod;
    head: HTTPMethod;
    options: HTTPMethod;
}

abstract class TransportBase implements ITransport {
    abstract dispose(): void;

    abstract prepareTransportMethod(
        method: HTTPMethodType,
    ): (
        servicePath?: string,
        urlTemplate?: string,
        templateArgs?: StringTemplateArgs,
        options?: TransportCoreOptions,
    ) => Promise<OAPICallResult>;

    get = this.prepareTransportMethod('get');
    post = this.prepareTransportMethod('post');
    put = this.prepareTransportMethod('put');
    delete = this.prepareTransportMethod('delete');
    patch = this.prepareTransportMethod('patch');
    head = this.prepareTransportMethod('head');
    options = this.prepareTransportMethod('options');
}

export default TransportBase;
