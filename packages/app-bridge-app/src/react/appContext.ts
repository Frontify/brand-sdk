/* (c) Copyright Frontify Ltd., all rights reserved. */

import { AppBridgePlatformApp, type AssetActionContext, type AssetCreationContext } from '../AppBridgePlatformApp.ts';

/**
 * This function just helps to get the Context
 */
export const appContext = <T extends AssetActionContext | AssetCreationContext>(): T => {
    const appBridge = new AppBridgePlatformApp();
    return appBridge.context().get() as T;
};
