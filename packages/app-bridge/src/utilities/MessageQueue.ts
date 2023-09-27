/* (c) Copyright Frontify Ltd., all rights reserved. */

import { InitializationError } from '../errors';

export interface IMessageQueue {
    post(message: { method: string; parameter: unknown }): unknown;
}

export class MessageQueue implements IMessageQueue {
    private messageQueue: {
        message: unknown;
        resolve: (result: unknown) => void;
        reject: (result: unknown) => void;
    }[] = [];
    private isProcessing = false;

    constructor(private port: MessagePort) {}

    post(message: unknown) {
        return new Promise(async (resolve, reject) => {
            this.messageQueue.push({ message, resolve, reject });

            if (!this.isProcessing) {
                await this.processNextMessage();
            }
        });
    }

    async processNextMessage() {
        if (this.messageQueue.length > 0) {
            this.isProcessing = true;

            const messageQueue = this.messageQueue.shift();
            this.port.postMessage(messageQueue?.message);

            this.port.onmessage = async (event) => {
                messageQueue?.resolve(event.data);
                this.isProcessing = false;

                await this.processNextMessage();
            };

            this.port.onmessageerror = (error) => {
                messageQueue?.reject(error);
            };
        }
    }
}

export class ErrorMessageQueue implements IMessageQueue {
    post() {
        throw new InitializationError('First use await platformApp.dispatch({ name: "openConnection" })');
    }
}
