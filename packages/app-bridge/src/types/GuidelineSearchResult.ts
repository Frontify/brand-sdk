/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { CamelCasedPropertiesDeep } from 'type-fest';

export type GuidelineSearchResultApi = {
    highlights: string[];
    type: 'PAGE' | 'SECTION' | 'BLOCK' | 'COLOR';
    object_id: number;
    page_id: number;
    page_slug: string;
    page_title: string;
    page_category_slug: string | null;
    block_id: number;
    document_id: number;
    document_slug: string;
    document_title: string;
    portal_id: number;
    portal_token: string;
};

export type GuidelineSearchResult = CamelCasedPropertiesDeep<GuidelineSearchResultApi>;
