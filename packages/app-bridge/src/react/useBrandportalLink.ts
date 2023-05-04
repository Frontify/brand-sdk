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
    isLoading: boolean;
};

type Options = {
    /**
     * Whether it should fetch on mount.
     */
    enabled?: boolean;
};

export const useBrandportalLink = (
    appBridge: AppBridgeTheme,
    options: Options = { enabled: true },
): UseBrandportalLinkReturnType => {
    const [brandportalLink, setBrandportalLink] = useState<Nullable<BrandportalLink>>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBrandportalLink = async () => {
            setIsLoading(true);
            setBrandportalLink(await appBridge.getBrandportalLink());
            setIsLoading(false);
        };

        if (options.enabled) {
            try {
                fetchBrandportalLink();
            } catch (error) {
                console.error(error);
            }
        }
    }, [appBridge, options.enabled]);

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

        window.emitter.on('AppBridge:GuidelineBrandportalLinkAction', updateBrandportalLinkFromEvent);

        return () => {
            window.emitter.off('AppBridge:GuidelineBrandportalLinkAction', updateBrandportalLinkFromEvent);
        };
    }, [appBridge]);

    return { brandportalLink, isLoading };
};
