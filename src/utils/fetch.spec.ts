import { FetchResponse } from '../test/mocks/fetch';
import { installClock, uninstallClock, tick } from '../test/utils';
import { convertFetchSuccess, convertFetchReject } from './fetch';

describe('utils fetch', () => {
    it('images are downloaded as a binary blob', (done) => {
        const contentType = 'image/jpeg';
        const result = (new FetchResponse(
            200,
            'this is a binary image',
            contentType,
        ) as unknown) as Response;
        const promise = convertFetchSuccess('url', 'body', 0, result);

        promise.then((response) => {
            expect(response.response).toEqual('this is a binary image');
            expect(response.status).toEqual(200);
            expect(response.headers.get('content-type')).toEqual(contentType);
            expect(response.responseType).toEqual('blob');
            done();
        });

        Promise.resolve(promise);
    });

    it('octet-stream are downloaded as a binary blob', (done) => {
        const contentType = 'application/octet-stream';
        const result = (new FetchResponse(
            200,
            'this is generic binary data',
            contentType,
        ) as unknown) as Response;
        const promise = convertFetchSuccess('url', 'body', 0, result);

        promise.then((response) => {
            expect(response.response).toEqual('this is generic binary data');
            expect(response.status).toEqual(200);
            expect(response.headers.get('content-type')).toEqual(contentType);
            expect(response.responseType).toEqual('blob');
            done();
        });

        Promise.resolve(promise);
    });

    it('json is downloaded and converted to an object', (done) => {
        const contentType = 'application/json';
        const result = (new FetchResponse(
            200,
            '{"test":1}',
            contentType,
        ) as unknown) as Response;
        const promise = convertFetchSuccess('url', 'body', 0, result);

        promise.then((response) => {
            expect(response.response).toEqual({ test: 1 });
            expect(response.status).toEqual(200);
            expect(response.headers.get('content-type')).toEqual(contentType);
            expect(response.responseType).toEqual('json');
            done();
        });

        Promise.resolve(promise);
    });

    it('xslx is downloaded as a binary blob', (done) => {
        const contentType =
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        const result = (new FetchResponse(
            200,
            'this is a binary string',
            contentType,
        ) as unknown) as Response;
        const promise = convertFetchSuccess('url', 'body', 0, result);

        promise.then((response) => {
            expect(response.response).toEqual('this is a binary string');
            expect(response.status).toEqual(200);
            expect(response.headers.get('content-type')).toEqual(contentType);
            expect(response.responseType).toEqual('blob');
            done();
        });

        Promise.resolve(promise);
    });

    it('unknown file types are downloaded as text', (done) => {
        const contentType = 'unknown/file';
        const result = (new FetchResponse(
            200,
            'this is a string',
            contentType,
        ) as unknown) as Response;
        const promise = convertFetchSuccess('url', 'body', 0, result);

        promise.then((response) => {
            expect(response.response).toEqual('this is a string');
            expect(response.status).toEqual(200);
            expect(response.headers.get('content-type')).toEqual(contentType);
            expect(response.responseType).toEqual('text');
            done();
        });

        Promise.resolve(promise);
    });

    describe('clearing timers', () => {
        beforeEach(() => {
            installClock();
        });

        afterEach(() => {
            uninstallClock();
        });

        it('convertFetchSuccess clears timers', () => {
            const timerSpy = jest.fn().mockName('timerSpy');
            const timerId = setTimeout(timerSpy);
            const result = (new FetchResponse(
                200,
                'this is a string',
                'application/text',
            ) as unknown) as Response;
            convertFetchSuccess('url', 'body', timerId, result);
            tick(1);

            expect(timerSpy).not.toBeCalled();
        });

        it('convertFetchReject clears timers', () => {
            const timerSpy = jest.fn().mockName('timerSpy');
            const timerId = setTimeout(timerSpy);
            const promise = convertFetchReject(
                'url',
                'body',
                timerId,
                new Error(),
            ).catch(() => {});
            tick(1);

            expect(timerSpy).not.toBeCalled();

            return promise;
        });
    });
});
