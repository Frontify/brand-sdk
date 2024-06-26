/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type DocumentCategoryApi } from '../types';

export class DocumentCategoryApiDummy {
    static with(id: number, document_pages: number[] = []): DocumentCategoryApi {
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
            number_of_document_pages: document_pages.length,
        };
    }

    static withDocumentIdAndNumberOfDocumentPages(
        id: number,
        documentId: number,
        numberOfDocumentPages: number,
    ): DocumentCategoryApi {
        return {
            ...DocumentCategoryApiDummy.with(id),
            document_id: documentId,
            number_of_document_pages: numberOfDocumentPages,
        };
    }
}
