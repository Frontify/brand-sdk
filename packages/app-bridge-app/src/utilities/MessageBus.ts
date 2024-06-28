/* (c) Copyright Frontify Ltd., all rights reserved. */

import { InitializationError, TimeoutReachedError } from '../errors';

import { generateRandomString } from './hash';
import { SUBSCRIBE_TIMEOUT } from './subscribe';

export interface IMessageBus {
    post(message: { parameter: unknown }): unknown;
}

export class MessageBus implements IMessageBus {
    private messageBucket: {
        message: unknown;
        token: string;
        resolve: (value: unknown) => void;
    }[] = [];

    constructor(private port: MessagePort) {
        this.port.onmessage = (event) => {
            const { token } = event.data;
            const messageIndex = this.messageBucket.findIndex((item) => item.token === token);
            if (messageIndex > -1) {
                const message = this.messageBucket.splice(messageIndex, 1)[0];
                if (message) {
                    message.resolve(event.data.message);
                }
            }
        };
    }

    public post(message: unknown) {
        return new Promise((resolve, reject) => {
            const token = generateRandomString();

            this.messageBucket.push({ message, resolve, token });
            this.port.postMessage({ message, token });

            setTimeout(() => {
                reject(new TimeoutReachedError('operation'));
            }, SUBSCRIBE_TIMEOUT * 10);
        });
    }
}

export class ErrorMessageBus implements IMessageBus {
    post() {
        throw new InitializationError('First use await platformApp.dispatch({ name: "openConnection" })');
    }
}
