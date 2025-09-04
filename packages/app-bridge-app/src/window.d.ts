/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type AppBridgePlatformApp } from './AppBridgePlatformApp.ts';

declare global {
    interface Window {
        appBridgePlatformApp: AppBridgePlatformApp;
    }
}

export {};
