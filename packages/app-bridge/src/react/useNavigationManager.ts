/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { AppBridgeTheme } from '../AppBridgeTheme';
import { openNavigationManager } from '../commands';

export const useNavigationManager = (appBridge: AppBridgeTheme) => {
    return {
        openNavigationManager: () => appBridge.dispatch(openNavigationManager()),
    };
};
