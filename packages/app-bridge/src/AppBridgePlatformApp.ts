/* (c) Copyright Frontify Ltd., all rights reserved. */

import { ErrorMessageBus, IMessageBus, MessageBus } from './utilities/MessageBus';
import { generateRandomString, notify, subscribe } from './utilities';
import { MethodsListKeys, PlatformAppMethods, Topic } from './types';
import { PlatformAppContext } from './types/PlatformAppContext';

const PUBSUB_CHECKSUM = generateRandomString();

type InitializeEvent = {
    port: MessagePort;
};

export class AppBridgePlatformApp {
    private messageBus: IMessageBus = new ErrorMessageBus();
    private initialized = false;

    public async initialize() {
        const queryParams = this.context();
        return new Promise<{ success: boolean }>((resolve, reject) => {
            try {
                if (queryParams.token && !this.initialized) {
                    notify(Topic.Init, PUBSUB_CHECKSUM, { token: queryParams.token });
                    subscribe<InitializeEvent>(Topic.Init, PUBSUB_CHECKSUM).then(({ port }) => {
                        this.messageBus = new MessageBus(port);
                        this.initialized = true;
                        console.debug('Connected and Initialized');
                        resolve({ success: true });
                    });
                } else {
                    resolve({ success: false });
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    public async api<Method extends PlatformAppMethods[MethodsListKeys][0]>(
        method: Method,
    ): Promise<PlatformAppMethods[Method['name']][1] | { errors: { message: string } }> {
        return await this.messageBus.post<
            Promise<
                | PlatformAppMethods[Method['name']][1]
                | {
                      errors: { message: string };
                  }
            >
        >(method.name);
    }

    public context(): PlatformAppContext {
        return Object.fromEntries(new URLSearchParams(window.location.search)) as unknown as PlatformAppContext;
    }
}
