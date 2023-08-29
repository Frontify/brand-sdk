/* (c) Copyright Frontify Ltd., all rights reserved. */

import { InitializationError, TimeoutReachedError } from '../errors';
import { SUBSCRIBE_TIMEOUT } from './subscribe';

export interface IMessageBus {
    post(message: unknown): unknown;
}

export class MessageBus implements IMessageBus {
    constructor(private port: MessagePort) {}

    public post(message: unknown) {
        return new Promise((resolve, reject) => {
            this.port.postMessage(message);

            this.port.onmessage = (event) => {
                resolve(event.data);
            };
            this.port.onmessageerror = (error) => {
                reject(error);
            };
            setTimeout(() => {
                reject(new TimeoutReachedError('operation'));
            }, SUBSCRIBE_TIMEOUT);
        });
    }
}

export class ErrorMessageBus implements IMessageBus {
    post() {
        throw new InitializationError('First use await platformApp.dispatch({ name: "openConnection" })');
    }
}
