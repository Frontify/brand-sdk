/* (c) Copyright Frontify Ltd., all rights reserved. */

import { AppBridgePlatformApp } from '../AppBridgePlatformApp.ts';

export const appUserState = <T>(): [T, (settings: Partial<T>) => void] => {
    const appBridge = new AppBridgePlatformApp();

    return [
        appBridge.state('userState').get() as T,
        appBridge.state('userState').set as (settings: Partial<T>) => void,
    ];
};
