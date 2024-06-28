/* (c) Copyright Frontify Ltd., all rights reserved. */

import { AppBridgePlatformApp } from '../AppBridgePlatformApp.ts';

export const appSettings = <T>(): [T, (settings: Partial<T>) => void] => {
    const appBridge = new AppBridgePlatformApp();

    return [appBridge.state('settings').get() as T, appBridge.state('settings').set as (settings: Partial<T>) => void];
};
