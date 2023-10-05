/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { CamelCasedPropertiesDeep } from 'type-fest';

export const GuidelineSearchResultType = {
    block: 'BLOCK',
    section: 'SECTION',
    page: 'PAGE',
    color: 'COLOR',
} as const;
type GuidelineSearchResultType = (typeof GuidelineSearchResultType)[keyof typeof GuidelineSearchResultType];

export type GuidelineSearchResultApi = {
    highlights: string[];
    type: GuidelineSearchResultType;
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
    portal_token: string | null;
    section_id: string | null;
    section_slug: string | null;
    section_title: string | null;
    color_hex?: string;
};

export type GuidelineSearchResult = CamelCasedPropertiesDeep<GuidelineSearchResultApi>;
