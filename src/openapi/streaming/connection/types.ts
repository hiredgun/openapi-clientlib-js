import type { TRANSPORT_NAME_MAP } from './connection';
import type { IHubProtocol } from '@microsoft/signalr';
import type { READABLE_CONNECTION_STATE_MAP } from './constants';

export type TransportTypes = keyof typeof TRANSPORT_NAME_MAP;

export interface ConnectionOptions {
    waitForPageLoad?: boolean;
    transport?: Array<TransportTypes>;
    messageSerializationProtocol?: IHubProtocol;
}

export type ConnectionState = keyof typeof READABLE_CONNECTION_STATE_MAP;
