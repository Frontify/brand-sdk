/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';

import type { AppBridgeTheme } from '../AppBridgeTheme';
import type { CoverPage, EmitterAction } from '../types';

export type UseBrandportalLinkReturnType = {
    brandportalLink: Nullable<CoverPage>;
};

export const useBrandportalLink = (appBridge: AppBridgeTheme): UseBrandportalLinkReturnType => {
    const [brandportalLink, setBrandportalLink] = useState<Nullable<CoverPage>>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBrandportalLink = async () => {
            setBrandportalLink(await appBridge.getCoverPage());
        };

        if (isLoading) {
            fetchBrandportalLink();
            setIsLoading(false);
        }
    }, [appBridge, isLoading]);

    useEffect(() => {
        const updateBrandportalLinkFromEvent = (event: { brandportalLink: CoverPage; action: EmitterAction }) => {
            setBrandportalLink((previousState) => {
                if (event.action === 'add') {
                    setIsLoading(true);
                    return previousState;
                }

                if (event.action === 'delete') {
                    return null;
                }

                if (event.action === 'update') {
                    return { ...previousState, ...event.brandportalLink };
                }

                return previousState;
            });
        };

        window.emitter.on('AppBridge:GuidelineBrandportalLinkUpdate', updateBrandportalLinkFromEvent);

        return () => {
            window.emitter.off('AppBridge:GuidelineBrandportalLinkUpdate', updateBrandportalLinkFromEvent);
        };
    }, [appBridge]);

    return { brandportalLink };
};
