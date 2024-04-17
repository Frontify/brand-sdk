/* (c) Copyright Frontify Ltd., all rights reserved. */

import debounce from 'lodash-es/debounce';
import { useCallback, useEffect, useState } from 'react';
import { type EmitterEvents } from 'src/types';

import { type AppBridgeTheme } from '../AppBridgeTheme';
import { type DocumentNavigationItem } from '../types/Guideline';

type Options = {
    /**
     * Whether it should fetch on mount.
     */
    enabled?: boolean;
};

export const useDocumentNavigation = (appBridge: AppBridgeTheme, options: Options = { enabled: true }) => {
    const [navigationItems, setNavigationItems] = useState<DocumentNavigationItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const refetch = useCallback(async () => {
        setIsLoading(true);
        setNavigationItems(await appBridge.api({ name: 'getDocumentNavigation' }));
        setIsLoading(false);
    }, [appBridge]);

    const refetchAfter100Ms = () => debounce(refetch, 100);

    useEffect(() => {
        if (options.enabled) {
            refetch();
        }
    }, [options.enabled, refetch]);

    useEffect(() => {
        const eventsThatTriggerRefetch: (keyof EmitterEvents)[] = [
            'AppBridge:GuidelineDocumentCategory:Action',
            'AppBridge:GuidelineDocumentPage:Action',
            'AppBridge:GuidelineDocumentPageTargets:Action',
        ];

        for (const event of eventsThatTriggerRefetch) {
            window.emitter.on(event, refetchAfter100Ms);
        }

        return () => {
            for (const event of eventsThatTriggerRefetch) {
                window.emitter.off(event, refetchAfter100Ms);
            }
        };
    }, [navigationItems, refetch]);

    return { navigationItems, refetch, isLoading };
};
