/* (c) Copyright Frontify Ltd., all rights reserved. */

import debounce from 'lodash-es/debounce';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { type AppBridgeTheme } from '../AppBridgeTheme';
import { type GuidelineDocument, type DocumentNavigationItem } from '../types/Guideline';

type Options = {
    /**
     * Whether it should fetch on mount.
     */
    enabled?: boolean;
};

export const useDocumentNavigation = (
    appBridge: AppBridgeTheme,
    document: GuidelineDocument,
    options: Options = { enabled: true },
) => {
    const [navigationItems, setNavigationItems] = useState<DocumentNavigationItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const refetch = useCallback(async () => {
        setIsLoading(true);
        setNavigationItems(await appBridge.api({ name: 'getDocumentNavigation', payload: { document } }));
        setIsLoading(false);
    }, [appBridge, document]);

    useEffect(() => {
        if (options.enabled) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises, react-hooks/set-state-in-effect
            refetch();
        }
    }, [options.enabled, refetch]);

    // eslint-disable-next-line @eslint-react/no-unnecessary-use-memo
    const debouncedRefetch = useMemo(
        () =>
            debounce(() => {
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                refetch();
            }, 100),
        [refetch],
    );

    useEffect(() => {
        window.emitter.on('AppBridge:GuidelineDocumentCategory:Action', debouncedRefetch);
        window.emitter.on('AppBridge:GuidelineDocumentCategory:DocumentPageAction', debouncedRefetch);
        window.emitter.on('AppBridge:GuidelineDocumentCategory:MoveEvent', debouncedRefetch);

        window.emitter.on('AppBridge:GuidelineDocumentPage:Action', debouncedRefetch);
        window.emitter.on('AppBridge:GuidelineDocumentPage:MoveEvent', debouncedRefetch);
        window.emitter.on('AppBridge:GuidelineDocumentPageTargets:Action', debouncedRefetch);

        window.emitter.on('AppBridge:GuidelineDocumentSection:Action', debouncedRefetch);

        return () => {
            window.emitter.off('AppBridge:GuidelineDocumentCategory:Action', debouncedRefetch);
            window.emitter.off('AppBridge:GuidelineDocumentCategory:DocumentPageAction', debouncedRefetch);
            window.emitter.off('AppBridge:GuidelineDocumentCategory:MoveEvent', debouncedRefetch);

            window.emitter.off('AppBridge:GuidelineDocumentPage:Action', debouncedRefetch);
            window.emitter.off('AppBridge:GuidelineDocumentPage:MoveEvent', debouncedRefetch);
            window.emitter.off('AppBridge:GuidelineDocumentPageTargets:Action', debouncedRefetch);

            window.emitter.off('AppBridge:GuidelineDocumentSection:Action', debouncedRefetch);
        };
    }, [navigationItems, debouncedRefetch]);

    return { navigationItems, refetch, isLoading };
};
