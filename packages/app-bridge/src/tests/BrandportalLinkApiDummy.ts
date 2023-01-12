/* (c) Copyright Frontify Ltd., all rights reserved. */

import { BrandportalLinkApi } from '../types';

export class BrandportalLinkApiDummy {
    static get(): BrandportalLinkApi {
        return {
            brand_portal: {
                enabled: true,
                label: 'Brandportal Link',
                url: '/url',
            },
        };
    }
}
