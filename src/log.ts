import MicroEmitter from './micro-emitter';

export interface ILogger {
    error(...args: unknown[]): void;
    warn(...args: unknown[]): void;
    info(...args: unknown[]): void;
    debug(...args: unknown[]): void;
}

const ERROR = 'error';
const WARN = 'warn';
const INFO = 'info';
const DEBUG = 'debug';

type EventNames = typeof ERROR | typeof WARN | typeof INFO | typeof DEBUG;
type EmittedEvents = {
    [name in EventNames]: (
        logArea: string,
        message: string,
        context?: any,
        options?: Record<string, any>,
    ) => void;
};

/**
 * The shared js log, which allows posting messages and listening to them.
 * @example
 * // to log
 * ```ts
 * log.warn("Area", "Warning... such and so...", { data: context});
 * ```
 * // to listen to all logs on the console
 *
 * ```ts
 * log.on(log.DEBUG, console.debug.bind(console));
 * log.on(log.INFO, console.info.bind(console));
 * log.on(log.WARN, console.info.bind(console));
 * log.on(log.ERROR, console.error.bind(console));
 * ```
 */
export class Log extends MicroEmitter<EmittedEvents> implements ILogger {
    /**
     * The Debug event constant.
     */
    readonly DEBUG = DEBUG;
    /**
     * The info event constant.
     */
    readonly INFO = INFO;
    /**
     * The warn event constant.
     */
    readonly WARN = WARN;
    /**
     * the error event constant.
     */
    readonly ERROR = ERROR;

    error = (...args: Parameters<EmittedEvents[typeof ERROR]>) =>
        this.trigger(this.ERROR, ...args);
    warn = (...args: Parameters<EmittedEvents[typeof WARN]>) =>
        this.trigger(this.WARN, ...args);
    info = (...args: Parameters<EmittedEvents[typeof INFO]>) =>
        this.trigger(this.INFO, ...args);
    debug = (...args: Parameters<EmittedEvents[typeof DEBUG]>) =>
        this.trigger(this.DEBUG, ...args);
}

export default new Log();
