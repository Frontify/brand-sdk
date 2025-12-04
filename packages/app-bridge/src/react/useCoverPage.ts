/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useCallback, useEffect, useState } from 'react';

import { type AppBridgeTheme } from '../AppBridgeTheme';
import { type CoverPage, type EmitterAction } from '../types';

export type UseCoverPageReturnType = {
    coverPage: Nullable<CoverPage>;
    isLoading: boolean;
};

type Options = {
    /**
     * Whether it should fetch on mount.
     */
    enabled?: boolean;
};

export const useCoverPage = (
    appBridge: AppBridgeTheme,
    options: Options = { enabled: true },
): UseCoverPageReturnType => {
    const [coverPage, setCoverPage] = useState<Nullable<CoverPage>>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCoverPage = useCallback(async () => {
        setIsLoading(true);
        setCoverPage(await appBridge.getCoverPage());
        setIsLoading(false);
    }, [appBridge]);

    useEffect(() => {
        if (options.enabled) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            fetchCoverPage().catch(console.error);
        }
    }, [appBridge, fetchCoverPage, options.enabled]);

    useEffect(() => {
        const updateCoverPageFromEvent = (event: { action: EmitterAction; coverPage?: CoverPage }) => {
            if (event.action === 'add') {
                fetchCoverPage().catch(console.error);
                return;
            }

            setCoverPage((previousState) => {
                if (event.action === 'delete') {
                    return null;
                }

                if (event.action === 'update' && event.coverPage) {
                    return { ...previousState, ...event.coverPage };
                }

                return previousState;
            });
        };

        window.emitter.on('AppBridge:GuidelineCoverPage:Action', updateCoverPageFromEvent);

        return () => {
            window.emitter.off('AppBridge:GuidelineCoverPage:Action', updateCoverPageFromEvent);
        };
    }, [appBridge, fetchCoverPage]);

    return { coverPage, isLoading };
};
