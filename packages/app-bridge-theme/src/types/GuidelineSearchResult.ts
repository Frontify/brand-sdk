/* (c) Copyright Frontify Ltd., all rights reserved. */

export const GuidelineSearchResultTypeMap = {
    block: 'BLOCK',
    section: 'SECTION',
    page: 'PAGE',
    /** @deprecated Frontify retired color search results, so no result has this type anymore. */
    color: 'COLOR',
};
type GuidelineSearchResultType = (typeof GuidelineSearchResultTypeMap)[keyof typeof GuidelineSearchResultTypeMap];

export type GuidelineSearchResult = {
    highlights: string[];
    type: GuidelineSearchResultType;
    objectId: number;
    pageId: number;
    pageSlug: string;
    pageTitle: string;
    pageCategorySlug: string | null;
    blockId: number;
    documentId: number;
    documentSlug: string;
    documentTitle: string;
    portalId: number;
    portalToken: string | null;
    sectionId: string | null;
    sectionSlug: string | null;
    sectionTitle: string | null;
    /** @deprecated Frontify retired color search results, so it is never set anymore. */
    colorHex?: string;
    /** @deprecated Frontify retired color search results, so it is never set anymore. */
    projectColorId?: string;
    guidelineTitle: string;
};
