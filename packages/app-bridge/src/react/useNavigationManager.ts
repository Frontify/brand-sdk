/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { AppBridgeTheme } from '../AppBridgeTheme';

export const useNavigationManager = (appBridge: AppBridgeTheme) => {
    const { openNavigationManager } = appBridge;

    return {
        openNavigationManager: () => openNavigationManager(),
    };
};
