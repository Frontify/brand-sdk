/* (c) Copyright Frontify Ltd., all rights reserved. */

import { InitializationError, TimeoutReachedError } from '../errors';
import { SUBSCRIBE_TIMEOUT } from './subscribe';
import { generateRandomString } from './hash';

export interface IMessageBus {
    post(message: { method: string; parameter: unknown }): unknown;
}

export class MessageBus implements IMessageBus {
    private messageBucket: {
        message: unknown;
        token: string;
        resolve: (value: PromiseLike<unknown> | unknown) => void;
        reject: (reason?: unknown) => void;
    }[] = [];

    constructor(private port: MessagePort) {
        this.port.onmessage = (event) => {
            const { token } = event.data;
            const messageIndex = this.messageBucket.findIndex((item) => item.token === token);
            console.log('messageIndex', messageIndex);
            if (messageIndex > -1) {
                const message = this.messageBucket.splice(messageIndex, 1)[0];
                message.resolve(event.data.message);
            }
        };

        // this.port.onmessageerror = (error) => {
        //     reject(error);
        // };
    }

    public post(message: unknown) {
        return new Promise((resolve, reject) => {
            const nextMessage = { message, resolve, reject, token: generateRandomString() };

            this.messageBucket.push(nextMessage);
            this.port.postMessage({ message: nextMessage.message, token: nextMessage.token });

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
