/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Topic } from './types';
import { generateRandomString } from './utilities/hash';
import { NotifyData, notify } from './utilities/notify';
import { subscribe } from './utilities/subscribe';

const PUBSUB_TOKEN = generateRandomString();

const getQueryParams = () => ({
    assetId: 1551122,
    view: 'asset-creation',
});

export class AppBridgePlatformApp {
    setContextData() {
        return getQueryParams();
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
