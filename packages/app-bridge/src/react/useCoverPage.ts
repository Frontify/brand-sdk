/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';

import type { AppBridgeTheme } from '../AppBridgeTheme';
import type { CoverPage, EmitterAction } from '../types';

export type UseCoverPageReturnType = {
    coverPage: Nullable<CoverPage>;
    isLoading: boolean;
};

export const useCoverPage = (appBridge: AppBridgeTheme): UseCoverPageReturnType => {
    const [coverPage, setCoverPage] = useState<Nullable<CoverPage>>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCoverPage = async () => {
            setCoverPage(await appBridge.getCoverPage());
        };

        if (isLoading) {
            fetchCoverPage();
            setIsLoading(false);
        }
    }, [appBridge, isLoading]);

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
