/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type AppBridgeTheme } from '../AppBridgeTheme';

// oxlint-disable-next-line @eslint-react/no-unnecessary-use-prefix
export const useNavigationManager = (appBridge: AppBridgeTheme) => {
    const { openNavigationManager } = appBridge;

    return {
        openNavigationManager: () => openNavigationManager(),
    };
};
