/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useSyncExternalStore } from 'react';

import { type AppBridgeTheme } from '../AppBridgeTheme';
import { type PortalNavigationItem } from '../types/Guideline';

export const usePortalNavigation = (appBridge: AppBridgeTheme) => {
    const portalNavigation = useSyncExternalStore(
        appBridge.context('portalNavigation').subscribe,
        appBridge.context('portalNavigation').get,
    );

    const portalNavigationItems = (portalNavigation ?? []).filter((item) => {
        if (
            'isHiddenInNavigation' in item &&
            typeof item.isHiddenInNavigation === 'function' &&
            item.type !== 'cover-page'
        ) {
            return !(item as PortalNavigationItem & { isHiddenInNavigation: () => boolean }).isHiddenInNavigation();
        }

        return true;
    });

    return portalNavigationItems;
};
