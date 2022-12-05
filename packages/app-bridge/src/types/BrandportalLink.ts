/* (c) Copyright Frontify Ltd., all rights reserved. */

export type BrandportalLinkApi = {
    brand_portal: {
        enabled: boolean;
        label: string;
        url: string;
    };
};

export type BrandportalLink = BrandportalLinkApi['brand_portal'];
