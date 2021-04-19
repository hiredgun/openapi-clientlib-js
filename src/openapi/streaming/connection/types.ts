import type { TRANSPORT_NAME_MAP } from './connection';
import type { IHubProtocol } from '@microsoft/signalr';

export type TransportTypes = keyof typeof TRANSPORT_NAME_MAP;

export interface ConnectionOptions {
    waitForPageLoad: boolean;
    transport?: Array<TransportTypes>;
    messageSerializationProtocol?: IHubProtocol;
}
