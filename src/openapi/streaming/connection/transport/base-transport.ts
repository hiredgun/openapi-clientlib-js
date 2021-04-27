import type { TransportTypes, ConnectionOptions } from '../types';

interface Callback {
    (...arg: unknown[]): unknown;
}

export interface StreamingTransportOptions extends ConnectionOptions {
    transportType?: TransportTypes;
    skipNegotiation?: boolean;
}

export interface StramingTransport {
    start(
        transportOptions: StreamingTransportOptions,
        startCallback: Callback,
    ): void;
    stop(): void;
    name: string;
    getQuery(): unknown;
    onOrphanFound(): unknown;
    updateQuery(
        authToken: string,
        contextId: string,
        authExpiry: number,
        forceAuth?: boolean,
    ): void;
    getTransport(): unknown;
    onSubscribeNetworkError?: () => void;
    setReceivedCallback(callback: Callback): unknown;
    setStateChangedCallback(callback: Callback): unknown;
    setUnauthorizedCallback(callback: Callback): unknown;
    setConnectionSlowCallback(callback: Callback): unknown;
}
