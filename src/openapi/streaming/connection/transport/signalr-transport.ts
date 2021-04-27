import log from '../../../../log';
import * as transportTypes from '../transportTypes';
import * as constants from '../constants';

const LOG_AREA = 'SignalRTransport';
const NOOP = () => {};

type Callback = (...args: any) => any;

/**
 * SignalR Transport which supports both webSocket and longPolling with internal fallback mechanism.
 */
class SignalrTransport {
    name = transportTypes.LEGACY_SIGNALR;
    transport = null;
    stateChangedCallback: (arg0?: number | null) => void | number = NOOP;
    unauthorizedCallback = NOOP;
    baseUrl: string;
    connectionUrl: string;
    connection: SignalR.Connection;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
        this.connectionUrl = `${baseUrl}/streaming/connection`;
        this.connection = $.connection(this.connectionUrl);

        this.connection.stateChanged(this.handleStateChanged);
        // @ts-expect-error we don't return Connection from the handleLog callback
        this.connection.log = this.handleLog;
        this.connection.error(this.handleError);
    }

    /**
     * Handles any signal-r log, and pipes it through our logging.
     * @param message
     */
    private handleLog = (message: string) => {
        log.debug(
            LOG_AREA,
            message.replace(/BEARER[^&]+/i, '[Redacted Token]'),
        );
    };

    /**
     * Handles a signal-r error
     * This occurs when data cannot be sent, or cannot be received or something unknown goes wrong.
     * signal-r attempts to keep the subscription and if it doesn't we will get the normal failed events
     */
    private handleError = (errorDetail: SignalR.ConnectionError) => {
        log.warn(LOG_AREA, 'Transport error', errorDetail);
        // @ts-expect-error FIXME according to types definition status exists on context not source - verify
        if (errorDetail?.source?.status === 401) {
            this.unauthorizedCallback();
        }
    };

    /**
     * Maps from the signalR connection state to the ConnectionState Enum
     */

    private mapConnectionState = (state: number) => {
        switch (state) {
            case $.signalR.connectionState.connecting:
                return constants.CONNECTION_STATE_CONNECTING;

            case $.signalR.connectionState.connected:
                return constants.CONNECTION_STATE_CONNECTED;

            case $.signalR.connectionState.disconnected:
                return constants.CONNECTION_STATE_DISCONNECTED;

            case $.signalR.connectionState.reconnecting:
                return constants.CONNECTION_STATE_RECONNECTING;

            default:
                log.warn(LOG_AREA, 'Unrecognised state', state);
                break;
        }

        return null;
    };

    private handleStateChanged = (payload: SignalR.StateChanged) => {
        if (typeof this.stateChangedCallback === 'function') {
            this.stateChangedCallback(
                this.mapConnectionState(payload.newState),
            );
        }
    };

    isSupported() {
        return true;
    }

    setUnauthorizedCallback(callback: Callback) {
        this.unauthorizedCallback = callback;
    }

    setStateChangedCallback(callback: Callback) {
        this.stateChangedCallback = callback;
    }

    setReceivedCallback(callback: Callback) {
        this.connection.received(callback);
    }

    setConnectionSlowCallback(callback: Callback) {
        this.connection.connectionSlow(callback);
    }

    start(options: SignalR.ConnectionOptions, callback: Callback) {
        this.connection.start(options, callback);
    }

    stop() {
        this.connection.stop();
    }

    updateQuery(authToken: string, contextId: string) {
        this.connection.qs = `authorization=${encodeURIComponent(
            authToken,
        )}&context=${encodeURIComponent(contextId)}`;
    }

    getQuery() {
        return this.connection.qs;
    }

    getTransport() {
        // @ts-expect-error transport property missing in type definition
        return this.connection.transport;
    }
}

export default SignalrTransport;
