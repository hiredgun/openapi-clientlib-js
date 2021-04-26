import type { TRANSPORT_NAME_MAP } from './connection';
import type { IHubProtocol } from '@microsoft/signalr';
import type {
    CONNECTION_STATE_INITIALIZING,
    CONNECTION_STATE_STARTED,
    CONNECTION_STATE_CONNECTING,
    CONNECTION_STATE_CONNECTED,
    CONNECTION_STATE_RECONNECTING,
    CONNECTION_STATE_DISCONNECTED,
    CONNECTION_STATE_FAILED,
} from './constants';

export type TransportTypes = keyof typeof TRANSPORT_NAME_MAP;

export interface ConnectionOptions {
    // FIXME looks like this option is not used anywhere - verify
    waitForPageLoad?: boolean;
    transport?: Array<TransportTypes>;
    messageSerializationProtocol?: IHubProtocol;
}

export type CONNECTION_STATE_TYPE =
    | typeof CONNECTION_STATE_INITIALIZING
    | typeof CONNECTION_STATE_STARTED
    | typeof CONNECTION_STATE_CONNECTING
    | typeof CONNECTION_STATE_CONNECTED
    | typeof CONNECTION_STATE_RECONNECTING
    | typeof CONNECTION_STATE_DISCONNECTED
    | typeof CONNECTION_STATE_FAILED;
