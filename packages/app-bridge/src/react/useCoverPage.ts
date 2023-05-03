/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';

import type { AppBridgeTheme } from '../AppBridgeTheme';
import type { CoverPage, EmitterAction } from '../types';

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

    useEffect(() => {
        const fetchCoverPage = async () => {
            setIsLoading(true);
            setCoverPage(await appBridge.getCoverPage());
            setIsLoading(false);
        };

        if (options.enabled) {
            fetchCoverPage();
        }
    }, [appBridge, options.enabled]);

    useEffect(() => {
        const updateCoverPageFromEvent = (event: { action: EmitterAction; coverPage?: CoverPage }) => {
            setCoverPage((previousState) => {
                if (event.action === 'add') {
                    setIsLoading(true);
                    return previousState;
                }

                if (event.action === 'delete') {
                    return null;
                }

                if (event.action === 'update' && event.coverPage) {
                    return { ...previousState, ...event.coverPage };
                }

                return previousState;
            });
        };

        window.emitter.on('AppBridge:GuidelineCoverPageAction', updateCoverPageFromEvent);

        return () => {
            window.emitter.off('AppBridge:GuidelineCoverPageAction', updateCoverPageFromEvent);
        };
    }, [appBridge]);

    return { coverPage, isLoading };
};
