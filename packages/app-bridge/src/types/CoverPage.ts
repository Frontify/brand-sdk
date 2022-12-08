/* (c) Copyright Frontify Ltd., all rights reserved. */

import { CamelCasedPropertiesDeep, Merge, Simplify, ValueOf } from 'type-fest';

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

export type CoverPageValidFields =
    | 'template'
    | 'documentId'
    | 'enabled'
    | 'url'
    | 'id'
    | 'hideInNav'
    | 'draft'
    | 'title';

export type ValidCoverPage = Pick<CoverPage, CoverPageValidFields>;

export type CoverPageUpdateLegacy = {
    brandhome_draft?: boolean;
    brandhome_title?: string;
    brandhome_hide_in_nav?: boolean;
};
