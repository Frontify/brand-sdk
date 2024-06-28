/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type GuidelineSearchResultApi } from '../types';

export class GuidelineSearchResultApiDummy {
    static with(query: string): GuidelineSearchResultApi {
        return {
            highlights: [query],
            type: 'BLOCK',
            object_id: 1,
            page_id: 1,
            page_slug: 'page-slug',
            page_title: 'Page Title',
            page_category_slug: 'page-category-slug',
            block_id: 1,
            document_id: 1,
            document_slug: 'document-slug',
            document_title: 'Document Title',
            guideline_title: 'Guideline Title',
            portal_id: 1,
            portal_token: 'portal-token',
            section_id: null,
            section_slug: null,
            section_title: null,
            color_hex: undefined,
            project_color_id: undefined,
        };
    }
}
