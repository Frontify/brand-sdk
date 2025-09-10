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
            const message = this.messageBucket.find((item) => item.token === token);
            if (message) {
                if (
                    this.hasParameterProperty(message.message) &&
                    message.message.parameter.name === 'executeSecureRequest'
                ) {
                    const { status, statusText, headers, body } = event.data;

                    const response = new Response(body, {
                        status,
                        statusText,
                        headers: new Headers(headers),
                    });

                    message.resolve(response);
                }
                message.resolve(event.data.message);
            }
        };
    }

    private hasParameterProperty(obj: any): obj is { parameter: any } {
        return obj && typeof obj === 'object' && 'parameter' in obj;
    }

    public post(message: unknown) {
        return new Promise((resolve, reject) => {
            const token = generateRandomString();

            this.messageBucket.push({ message, resolve, token });
            this.port.postMessage({ message, token });

            setTimeout(() => {
                reject(new TimeoutReachedError('operation'));
            }, SUBSCRIBE_TIMEOUT * 300);
        });
    }
}

export class ErrorMessageBus implements IMessageBus {
    post() {
        throw new InitializationError('First use await platformApp.dispatch({ name: "openConnection" })');
    }
}
