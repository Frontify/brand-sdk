/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type DocumentCategory } from '../types';

export class DocumentCategoryDummy {
    static with(id: number): DocumentCategory {
        return {
            id,
            creator: 9,
            created: '2022-08-15T11:47:47.000+00:00',
            modifier: null,
            modified: null,
            documentId: 456,
            validFrom: '2022-08-15T11:47:47.000+00:00',
            validTo: null,
            title: `Document Category Dummy ${id}`,
            slug: `document-category-dummy-${id}`,
            sort: 1,
            numberOfDocumentPages: 12,
        };
    }

    static withDocumentIdAndNumberOfDocumentPages(
        id: number,
        documentId: number,
        numberOfDocumentPages: number,
    ): DocumentCategory {
        return {
            id,
            creator: 9,
            created: '2022-08-15T11:47:47.000+00:00',
            modifier: null,
            modified: null,
            documentId,
            validFrom: '2022-08-15T11:47:47.000+00:00',
            validTo: null,
            title: `Document Category Dummy ${id}`,
            slug: `document-category-dummy-${id}`,
            sort: 1,
            numberOfDocumentPages,
        };
    }

    static withFields(fields: DocumentCategory): DocumentCategory {
        return {
            ...fields,
        };
    }
}
