import log from '../../log';
import TransportQueue from './queue';
import type TransportCore from './core';
import type { HTTPMethodType, OAPICallResult } from '../../utils/fetch';
import type { ITransport } from './transport-base';
import type { StringTemplateArgs } from '../../utils/string';
import type { TransportCoreOptions } from './types';

// fix-me typo
const LOG_AREA = 'TransportPutPatchDiagnosticsQueue';

/**
 * TransportPutPatchDiagnosticsQueue Waits on sending put and patch calls until a put/patch diagnostics call is successful.
 * If Either are not successful, it calls setUseXHttpMethodOverride with true on the passed transportCore.
 *
 * @param transport -
 *      The transport to wrap.
 * @param transportCore - (optional) The core transport at the bottom of the chain.
 */
class TransportPutPatchDiagnosticsQueue {
    isQueueing = true;
    transport: ITransport;
    transportQueue: TransportQueue;

    constructor(transport: ITransport, transportCore: TransportCore) {
        if (!transport) {
            throw new Error(
                'Missing required parameter: transport in TransportPutPatchDiagnosticsQueue',
            );
        }
        if (!transportCore) {
            throw new Error(
                'Missing required parameter: transportCore in TransportPutPatchDiagnosticsQueue',
            );
        }

        this.transport = transport;
        this.transportQueue = new TransportQueue(transport);

        const diagnosticsPut = transportCore.put('root', 'v1/diagnostics/put');

        const diagnosticsPatch = transportCore.patch(
            'root',
            'v1/diagnostics/patch',
        );

        this.transportQueue.waitFor(
            Promise.all([diagnosticsPut, diagnosticsPatch])
                .catch(() => {
                    transportCore.setUseXHttpMethodOverride(true);
                    log.info(
                        LOG_AREA,
                        'Diagnostic check for put/patch failed. Fallback to POST used',
                    );
                })
                .then(() => {
                    log.debug(
                        LOG_AREA,
                        'Diagnostics checks finished, continuing',
                    );
                    this.isQueueing = false;
                }),
        );
    }

    private putPatchTransportMethod(method: 'put' | 'patch') {
        return (
            servicePath: string,
            urlTemplate: string,
            templateArgs?: StringTemplateArgs,
            options?: TransportCoreOptions,
        ) => {
            const transport = this.isQueueing
                ? this.transportQueue
                : this.transport;
            return transport[method](
                servicePath,
                urlTemplate,
                templateArgs,
                options,
            );
        };
    }

    private otherMethodTransport(method: HTTPMethodType) {
        return (
            servicePath: string,
            urlTemplate: string,
            templateArgs?: StringTemplateArgs,
            options?: TransportCoreOptions,
        ) =>
            this.transport[method](
                servicePath,
                urlTemplate,
                templateArgs,
                options,
            );
    }

    private _putMethod = this.putPatchTransportMethod('put');
    private _patchMethod = this.putPatchTransportMethod('patch');
    private _getMethod = this.otherMethodTransport('get');
    private _postMethod = this.otherMethodTransport('post');
    private _deleteMethod = this.otherMethodTransport('delete');
    private _headMethod = this.otherMethodTransport('head');
    private _optionsMethod = this.otherMethodTransport('options');

    get<Response = any>(
        servicePath: string,
        urlTemplate: string,
        templateArgs?: StringTemplateArgs,
        options?: TransportCoreOptions,
    ): Promise<OAPICallResult<Response>> {
        return this._getMethod(servicePath, urlTemplate, templateArgs, options);
    }

    post<Response = any>(
        servicePath: string,
        urlTemplate: string,
        templateArgs?: StringTemplateArgs,
        options?: TransportCoreOptions,
    ): Promise<OAPICallResult<Response>> {
        return this._postMethod(
            servicePath,
            urlTemplate,
            templateArgs,
            options,
        );
    }

    put<Response = any>(
        servicePath: string,
        urlTemplate: string,
        templateArgs?: StringTemplateArgs,
        options?: TransportCoreOptions,
    ): Promise<OAPICallResult<Response>> {
        return this._putMethod(servicePath, urlTemplate, templateArgs, options);
    }

    /**
     * Does a delete request against open api.
     *
     * @param servicePath - The service path to make the call on
     * @param urlTemplate - The url path template which follows on from the service path to describe the path for the request.
     * @param templateArgs - An object containing fields matched to the template or null if there are no templateArgs.
     * @param options - (optional) request options
     * ```
     * options.headers - (optional) A object map of headers, header key to header value
     * options.cache - (optional) Override the default cache setting for this call.
     *                         If cache is false then a cache control "nocache" header will be added.
     *                         If cache is false and the method is get then a cache breaker will be added to the url.
     * options.queryParams - (optional) An object map of query params which will be added to
     *                        the URL.
     * ```
     * @returns A promise which will be resolved when a 2xx response is received, otherwise it will be failed.
     *                       The result in the case of success will be an object with a status (number) and a response property
     *                       which will be an object if the call returned with json, otherwise it will be text.
     *                       In the case of failure, there may be no result or there may be a result with a status or
     *                       there may be a result with status and a response, depending on what went wrong.
     * @example
     * ```ts
     * // The call
     * const promise = transport.delete("root", "path/to/{accountKey}", { accountKey: "123" }, {
     *                         headers: { "my-header": "header-value" },
     *                         cache: false,
     *                        queryParams: {a: b}});
     *
     * // makes a call to path/to/123?a=b
     * // success
     * promise.then(function(result) {
     *         console.log("The status is " + Number(result.status));
     *         console.log("My result is ...");
     *        console.dir(result.response);
     * });
     *
     * // failure
     * promise.catch(function(result) {
     *         if (result) {
     *             if (result.status) {
     *                 console.log("a call was made but returned status " + Number(result.status));
     *                 if (result.response) {
     *                     console.log("Open API's response was...");
     *                     console.dir(result.response);
     *                 }
     *             } else {
     *                 console.log("result could be an exception");
     *             }
     *         } else {
     *             console.log("an unknown error occurred");
     *         }
     * });
     * ```
     */
    delete<Response = any>(
        servicePath: string,
        urlTemplate: string,
        templateArgs?: StringTemplateArgs,
        options?: TransportCoreOptions,
    ): Promise<OAPICallResult<Response>> {
        return this._deleteMethod(
            servicePath,
            urlTemplate,
            templateArgs,
            options,
        );
    }

    patch<Response = any>(
        servicePath: string,
        urlTemplate: string,
        templateArgs?: StringTemplateArgs,
        options?: TransportCoreOptions,
    ): Promise<OAPICallResult<Response>> {
        return this._patchMethod(
            servicePath,
            urlTemplate,
            templateArgs,
            options,
        );
    }

    head<Response = any>(
        servicePath: string,
        urlTemplate: string,
        templateArgs?: StringTemplateArgs,
        options?: TransportCoreOptions,
    ): Promise<OAPICallResult<Response>> {
        return this._headMethod(
            servicePath,
            urlTemplate,
            templateArgs,
            options,
        );
    }

    options<Response = any>(
        servicePath: string,
        urlTemplate: string,
        templateArgs?: StringTemplateArgs,
        options?: TransportCoreOptions,
    ): Promise<OAPICallResult<Response>> {
        return this._optionsMethod(
            servicePath,
            urlTemplate,
            templateArgs,
            options,
        );
    }
}

export default TransportPutPatchDiagnosticsQueue;
