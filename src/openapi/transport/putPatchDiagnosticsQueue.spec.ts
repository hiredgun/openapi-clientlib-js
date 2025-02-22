import { setTimeout, installClock, uninstallClock } from '../../test/utils';
import mockTransport from '../../test/mocks/transport';
import TransportPutPatchDiagnosticsQueue from './putPatchDiagnosticsQueue';

describe('openapi TransportPutPatchDiagnosticsQueue', () => {
    let transport: any;
    let transportCore: any;
    let transportPutPatch: any;

    beforeEach(() => {
        transport = mockTransport();
        transportCore = mockTransport();
        installClock();
    });
    afterEach(function () {
        uninstallClock();
    });

    it('requires both arguments to the constructor', () => {
        expect(function () {
            // @ts-expect-error
            transportPutPatch = new TransportPutPatchDiagnosticsQueue();
        }).toThrow();
        expect(function () {
            // @ts-expect-error
            transportPutPatch = new TransportPutPatchDiagnosticsQueue({});
        }).toThrow();
        expect(function () {
            transportPutPatch = new TransportPutPatchDiagnosticsQueue(
                // @ts-expect-error
                null,
                {},
            );
        }).toThrow();
    });

    test.each`
        method
        ${'delete'}
        ${'get'}
        ${'post'}
        ${'options'}
    `(
        'Calls through straight away for non put/patch - $method',
        ({ method }) => {
            transportPutPatch = new TransportPutPatchDiagnosticsQueue(
                transport,
                transportCore,
            );

            const templateArgs = {};
            const options = {};
            transportPutPatch[method]('sg', 'url', templateArgs, options);

            expect(transport[method]).toHaveBeenCalledTimes(1);
            expect(transport[method]).toHaveBeenCalledWith(
                'sg',
                'url',
                templateArgs,
                options,
            );
        },
    );

    test.each`
        method
        ${'put'}
        ${'patch'}
    `(
        'Handles a $method failure',
        // @ts-ignore its breaking next test if we remove done but somehow its picking wrong type definition from JEST
        ({ method }, done) => {
            transportPutPatch = new TransportPutPatchDiagnosticsQueue(
                transport,
                transportCore,
            );
            expect(transportPutPatch.isQueueing).toEqual(true);

            const templateArgs = {};
            const options = {};
            transportPutPatch[method]('sg', 'url', templateArgs, options);

            expect(transport[method]).not.toHaveBeenCalled();
            expect(transportCore[method]).toHaveBeenCalledTimes(1);
            expect(transportCore[method]).toHaveBeenCalledWith(
                'root',
                `v1/diagnostics/${method}`,
            );

            transportCore[method + 'Reject']();
            setTimeout(() => {
                expect(
                    transportCore.setUseXHttpMethodOverride,
                ).toHaveBeenCalledTimes(1);
                expect(
                    transportCore.setUseXHttpMethodOverride,
                ).toHaveBeenCalledWith(true);
                expect(transportPutPatch.isQueueing).toEqual(false);

                expect(transport[method]).toHaveBeenCalledTimes(1);
                expect(transport[method]).toHaveBeenCalledWith(
                    'sg',
                    'url',
                    templateArgs,
                    options,
                );

                // test it now works without queuing
                transport[method].mockClear();
                transportPutPatch[method]('sg2', 'url2', templateArgs, options);
                expect(transport[method]).toHaveBeenCalledTimes(1);
                expect(transport[method]).toHaveBeenCalledWith(
                    'sg2',
                    'url2',
                    templateArgs,
                    options,
                );
                done();
            });
        },
    );

    it('handles successful put/patch', (done) => {
        transportPutPatch = new TransportPutPatchDiagnosticsQueue(
            transport,
            transportCore,
        );
        expect(transportPutPatch.isQueueing).toEqual(true);

        const templateArgs = {};
        const options = {};
        transportPutPatch.put('sg1', 'url1', templateArgs, options);
        transportPutPatch.patch('sg2', 'url2', templateArgs, options);

        expect(transport.put).not.toHaveBeenCalled();
        expect(transport.patch).not.toHaveBeenCalled();

        transportCore.putResolve();
        setTimeout(() => {
            expect(transportPutPatch.isQueueing).toEqual(true);
            expect(transport.put).not.toHaveBeenCalled();

            transportCore.patchResolve();
            setTimeout(() => {
                expect(transportPutPatch.isQueueing).toEqual(false);
                expect(
                    transportCore.setUseXHttpMethodOverride,
                ).not.toHaveBeenCalled();

                expect(transport.put).toHaveBeenCalledTimes(1);
                expect(transport.put).toHaveBeenCalledWith(
                    'sg1',
                    'url1',
                    templateArgs,
                    options,
                );
                expect(transport.patch).toHaveBeenCalledTimes(1);
                expect(transport.patch).toHaveBeenCalledWith(
                    'sg2',
                    'url2',
                    templateArgs,
                    options,
                );

                // test it now works without queuing
                transport.put.mockClear();
                transport.patch.mockClear();
                transportPutPatch.put('sg3', 'url3', templateArgs, options);
                transportPutPatch.patch('sg4', 'url4', templateArgs, options);
                expect(transport.put).toHaveBeenCalledTimes(1);
                expect(transport.put).toHaveBeenCalledWith(
                    'sg3',
                    'url3',
                    templateArgs,
                    options,
                );
                expect(transport.patch).toHaveBeenCalledTimes(1);
                expect(transport.patch).toHaveBeenCalledWith(
                    'sg4',
                    'url4',
                    templateArgs,
                    options,
                );
                done();
            });
        });
    });
});
