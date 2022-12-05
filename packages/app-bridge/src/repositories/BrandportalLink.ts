/* (c) Copyright Frontify Ltd., all rights reserved. */

import { BrandportalLink, BrandportalLinkApi } from '../types/BrandportalLink';
import { HttpClient } from '../utilities';

export const getBrandportalLink = async (hubId: number): Promise<BrandportalLink> => {
    const { result } = await HttpClient.get<BrandportalLinkApi>(`/api/document/navigation/${hubId}`);

    return result;
};

export const updateBrandportalLink = async (brandPortalLink: BrandportalLink): Promise<BrandportalLink> => {
    const { result } = await HttpClient.post<BrandportalLinkApi>(
        `/api/hub/settings/${brandPortalLink.portalId}`,
        brandPortalLink,
    );

    return result;
};
