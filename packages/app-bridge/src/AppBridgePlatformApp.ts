/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Topic } from './types';
import { generateRandomString } from './utilities/hash';
import { NotifyData, notify } from './utilities/notify';
import { subscribe } from './utilities/subscribe';
import { PlatformAppProperties } from './types/PlatformApp';

const PUBSUB_TOKEN = generateRandomString();

export class AppBridgePlatformApp {
    setContextData(): PlatformAppProperties {
        const params = {};
        const searchParams = new URLSearchParams(window.location.search);

        // Display the keys
        // @ts-ignore
        for (const key of searchParams.keys()) {
            // @ts-ignore
            params[key] = searchParams.get(key);
        }

        return params;
    }

    /**
     * Everything from here uses sub pattern, there might be a chance to do it differently
     * Could that be done through the public API with a login?
     */
    getAppState<T = Record<string, unknown>>(): Promise<T> {
        notify(Topic.GetAppState, PUBSUB_TOKEN);
        return subscribe<T>(Topic.GetAppState, PUBSUB_TOKEN);
    }

    async putAppState(newState: NotifyData): Promise<boolean> {
        notify(Topic.PutAppState, PUBSUB_TOKEN, newState);
        return subscribe<boolean>(Topic.PutAppState, PUBSUB_TOKEN);
    }

    async deleteAppState(): Promise<boolean> {
        notify(Topic.DeleteAppState, PUBSUB_TOKEN);
        return subscribe<boolean>(Topic.DeleteAppState, PUBSUB_TOKEN);
    }

    closeApp(): void {
        notify(Topic.CloseApp, PUBSUB_TOKEN);
    }
}
