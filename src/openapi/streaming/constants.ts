import * as streamingTransports from './connection/transportTypes';

export const OPENAPI_CONTROL_MESSAGE_PREFIX = '_';
export const OPENAPI_CONTROL_MESSAGE_HEARTBEAT = '_heartbeat';
export const OPENAPI_CONTROL_MESSAGE_RESET_SUBSCRIPTIONS =
    '_resetsubscriptions';
export const OPENAPI_CONTROL_MESSAGE_RECONNECT = '_reconnect';
export const OPENAPI_CONTROL_MESSAGE_DISCONNECT = '_disconnect';

export const DEFAULT_CONNECT_RETRY_DELAY = 1000;

export const LOG_AREA = 'Streaming';

export const DEFAULT_STREAMING_OPTIONS = {
    waitForPageLoad: false,
    transportTypes: [
        streamingTransports.LEGACY_SIGNALR_WEBSOCKETS,
        streamingTransports.LEGACY_SIGNALR_LONG_POLLING,
    ],
};
