/* eslint-disable import/no-named-as-default-member */

import mockDate from 'mockdate';

function multiline(...args: string[]) {
    return args.join('\r\n');
}

let clock = false;
function installClock() {
    jest.useFakeTimers();
    mockDate.set(new Date(2015, 3, 27));
    clock = true;
}

function tick(n: number) {
    mockDate.set(new Date(Date.now() + n));
    jest.advanceTimersByTime(n);
}

function uninstallClock() {
    if (!clock) {
        throw new Error('no clock');
    }
    clock = false;
    jest.clearAllTimers();
    jest.useRealTimers();
}

const unMockedSetTimeout = global.setTimeout;
const setTimeout = (fn: () => void) => unMockedSetTimeout(fn, 0);

const waterfallTimeout = (arr: Array<() => void>, startIndex?: number) => {
    unMockedSetTimeout(() => {
        startIndex = startIndex || 0;
        arr[startIndex]();
        if (arr.length > startIndex + 1) {
            waterfallTimeout(arr, startIndex + 1);
        }
    }, 0);
};

const getResolvablePromise = () => {
    let resolver: (value?: unknown) => void;
    let rejecter: (value?: unknown) => void;

    const promise = new Promise((resolve, reject) => {
        resolver = resolve;
        rejecter = reject;
    });

    return {
        promise,
        // @ts-expect-error TS complains that variable is used before initialized
        resolve: resolver,
        // @ts-expect-error TS complains that variable is used before initialized
        reject: rejecter,
    };
};

export {
    tick,
    setTimeout,
    multiline,
    installClock,
    uninstallClock,
    mockDate,
    waterfallTimeout,
    getResolvablePromise,
};
