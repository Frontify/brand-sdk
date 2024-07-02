/* (c) Copyright Frontify Ltd., all rights reserved. */

import { AppBridgePlatformApp } from './AppBridgePlatformApp.ts';

declare global {
    interface Window {
        appBridgePlatformApp: AppBridgePlatformApp;
    }
}

export {};
