/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type CamelCasedPropertiesDeep, type Merge, type Simplify, type ValueOf } from 'type-fest';

export type CoverPageTemplate = 'hub' | 'explorer' | 'story' | 'cover' | 'blank';

export type CoverPageApi = {
    brandhome: {
        id: number;
        url: string;
        draft: 0 | 1;
        title: string;
        enabled: 0 | 1;
        active: boolean;
        hide_in_nav: boolean;
    };
    items?: unknown;
    brand_portal?: unknown;
    document_groups?: unknown;
    navigation_mode?: unknown;
    template: CoverPageTemplate;
    document_id: string;
};

export type CoverPage = Merge<
    CamelCasedPropertiesDeep<
        Simplify<ValueOf<CoverPageApi, 'brandhome'> & Pick<CoverPageApi, 'template' | 'document_id'>>
    >,
    {
        draft: boolean;
        enabled: boolean;
    }
>;
