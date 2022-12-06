/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { DocumentPageCategoryApi, DocumentPageApi } from '../types';

export class DocumentCategoryApiDummy {
    static with(id: number, documentPages: DocumentPageApi[]): DocumentPageCategoryApi {
        return {
            id,
            creator: 9,
            created: '2022-08-15T11:47:47.000+00:00',
            modifier: null,
            modified: null,
            document_id: 456,
            valid_from: '2022-08-15T11:47:47.000+00:00',
            valid_to: null,
            title: `Document Category Dummy ${id}`,
            slug: `document-category-dummy-${id}`,
            sort: 1,
            document_pages: documentPages,
        };
    }
}
