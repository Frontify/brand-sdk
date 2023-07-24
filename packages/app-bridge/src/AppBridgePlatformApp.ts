/* (c) Copyright Frontify Ltd., all rights reserved. */

import { ErrorMessageBus, IMessageBus, MessageBus } from './utilities/MessageBus';
import { generateRandomString, notify, subscribe } from './utilities';
import { MethodsListKeys, PlatformAppMethods, Topic } from './types';
import { InitializationError } from './errors/InitializationError';
import { getQueryParameters } from './utilities/queryParams';

const PUBSUB_CHECKSUM = generateRandomString();

type InitializeEvent = {
    port: MessagePort;
};

export class AppBridgePlatformApp {
    private messageBus: IMessageBus = new ErrorMessageBus();
    private initialized = false;

    public async initialize() {
        const queryParams = this.context();
        return new Promise<void>(async (resolve, reject) => {
            if (queryParams?.token && !this.initialized) {
                notify(Topic.Init, PUBSUB_CHECKSUM, { token: queryParams.token });
                const { port } = await subscribe<InitializeEvent>(Topic.Init, PUBSUB_CHECKSUM);
                this.messageBus = new MessageBus(port);
                this.initialized = true;
                resolve();
            } else {
                reject(new InitializationError());
            }
        });
    }

    public async api<Method extends PlatformAppMethods[MethodsListKeys][0]>(
        method: Method,
    ): Promise<PlatformAppMethods[Method['operation']][1]> {
        return await this.messageBus.post<Promise<PlatformAppMethods[Method['operation']][1]>>(method);
    }

    public context() {
        return getQueryParameters(window.location.href);
    }
}
