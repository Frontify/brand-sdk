/* (c) Copyright Frontify Ltd., all rights reserved. */

import { HttpClient } from '../utilities';
import type { BrandportalLink, BrandportalLinkApi } from '../types';

export const getBrandportalLink = async (hubId: number): Promise<BrandportalLink> => {
    const { result } = await HttpClient.get<BrandportalLinkApi>(`/api/document/navigation/${hubId}`);

    return (result as unknown as BrandportalLinkApi)?.brand_portal ?? null;
};

export const updateBrandportalLink = async (
    brandportalLink: Partial<BrandportalLink> & {
        portalId?: number;
        i18n: string;
    },
): Promise<Partial<BrandportalLink> | null> => {
    const { portalId, ...brandportalLinkData } = brandportalLink;

    const { result } = await HttpClient.post<BrandportalLinkApi['brand_portal']>(`/api/hub/settings/${portalId}`, {
        brand_portal_link_enabled: brandportalLink.enabled,
        brand_portal_label: brandportalLink.label,
        brand_portal_link: brandportalLink.url,
        i18n: brandportalLink.i18n,
    });

    if (result.success) {
        return brandportalLinkData;
    } else {
        return null;
    }
};
