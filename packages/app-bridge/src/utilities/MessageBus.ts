/* (c) Copyright Frontify Ltd., all rights reserved. */

import { TimeoutReachedError } from '../errors';
import { SUBSCRIBE_TIMEOUT } from './subscribe';
import { InitializationError } from '../errors/InitializationError';

type ResponseEvent<T> = {
    data: PromiseLike<T>;
};

export interface IMessageBus {
    post<T>(methodName: string, data?: unknown): Promise<T>;
}

export class MessageBus implements IMessageBus {
    constructor(private port: MessagePort) {}

    public post<T>(methodName: string, data?: unknown): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.port.postMessage({ methodName, query: data });

            this.port.onmessage = (event: ResponseEvent<T>) => {
                resolve(event.data);
            };
            this.port.onmessageerror = (error) => {
                reject(error);
            };
            setTimeout(() => {
                reject(new TimeoutReachedError(methodName));
            }, SUBSCRIBE_TIMEOUT);
        });
    }
}

export class ErrorMessageBus implements IMessageBus {
    post<T>(): Promise<T> {
        throw new InitializationError('First use await appBridge.initialize()');
    }
}
