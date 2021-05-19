import type { TRANSPORT_NAME_MAP } from './connection';
import type { IHubProtocol } from '@microsoft/signalr';
import type {
    READABLE_CONNECTION_STATE_MAP,
    DATA_FORMAT_JSON,
    DATA_FORMAT_PROTOBUF,
} from './constants';

export type TransportTypes = keyof typeof TRANSPORT_NAME_MAP;

export interface ConnectionOptions {
    waitForPageLoad?: boolean;
    transport?: Array<TransportTypes>;
    messageSerializationProtocol?: IHubProtocol;
}

export type ConnectionState = keyof typeof READABLE_CONNECTION_STATE_MAP;

interface Callback {
    (): unknown;
}

export interface ReceiveCallback {
    (data: StreamingMessage): void;
}

export interface StateChangeCallback {
    (nextState: ConnectionState): void;
}

export interface StreamingTransportOptions extends ConnectionOptions {
    transportType?: TransportTypes;
    skipNegotiation?: boolean;
}

export interface StreamingTransportInterface {
    stateChangedCallback: (state: ConnectionState) => void;

    start(
        transportOptions: StreamingTransportOptions,
        startCallback?: Callback,
    ): void;
    stop(hasTransportError?: boolean): void;
    name: string;

    getQuery?(): string | null | undefined | void;
    updateQuery(
        authToken: string,
        contextId: string,
        authExpiry?: number | null,
        forceAuth?: boolean,
    ): void;

    onOrphanFound?(): unknown;
    getTransport?(): StreamingTransportInterface;
    onSubscribeNetworkError?: () => void;
    setReceivedCallback(callback: ReceiveCallback): void;
    setStateChangedCallback(callback: StateChangeCallback): void;
    setUnauthorizedCallback(callback: Callback): void;
    setConnectionSlowCallback(callback: Callback): void;
}

export type StreamingData =
    | Array<unknown>
    | Record<string, unknown>
    | BufferSource
    | string;

export type DataFormat = typeof DATA_FORMAT_JSON | typeof DATA_FORMAT_PROTOBUF;

export interface Heartbeats {
    OriginatingReferenceId: string;
    Reason: string;
}

export interface StreamingMessage<T = unknown, R = string> {
    ReferenceId: R;
    Timestamp?: string;
    MessageId?: string | null;
    ReservedField?: number;
    DataFormat?: DataFormat;
    Data: T;
}

export interface StreamingControlMessage<T = StreamingData, R = string>
    extends StreamingMessage<T, R> {
    Heartbeats?: Heartbeats[];
    TargetReferenceIds?: string[];
}
