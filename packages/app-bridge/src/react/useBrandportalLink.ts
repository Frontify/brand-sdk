/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';

import type { AppBridgeTheme } from '../AppBridgeTheme';
import type { BrandportalLink, EmitterAction } from '../types';

const defaultState: BrandportalLink = {
    enabled: false,
    label: '',
    url: '',
};

export type UseBrandportalLinkReturnType = {
    brandportalLink: Nullable<BrandportalLink>;
};

export const useBrandportalLink = (appBridge: AppBridgeTheme): UseBrandportalLinkReturnType => {
    const [brandportalLink, setBrandportalLink] = useState<Nullable<BrandportalLink>>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBrandportalLink = async () => {
            setBrandportalLink(await appBridge.getBrandportalLink());
        };

        if (isLoading) {
            fetchBrandportalLink();
            setIsLoading(false);
        }
    }, [appBridge, isLoading]);

    useEffect(() => {
        const updateBrandportalLinkFromEvent = (event: {
            brandportalLink: Partial<BrandportalLink>;
            action: Extract<EmitterAction, 'update'>;
        }) => {
            setBrandportalLink((previousState) => {
                if (event.action === 'update') {
                    return { ...defaultState, ...previousState, ...event.brandportalLink };
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
