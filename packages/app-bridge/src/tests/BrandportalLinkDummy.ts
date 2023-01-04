/* (c) Copyright Frontify Ltd., all rights reserved. */

import { BrandportalLink } from '../types';
import { convertObjectCase } from '../utilities';
import { BrandportalLinkApiDummy } from './BrandportalLinkApiDummy';

export class BrandportalLinkDummy {
    static with(fields?: Partial<BrandportalLink>): BrandportalLink {
        return { ...convertObjectCase(BrandportalLinkApiDummy.get().brand_portal, 'camel'), ...fields };
    }
}
