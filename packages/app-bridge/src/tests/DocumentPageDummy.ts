/* (c) Copyright Frontify Ltd., all rights reserved. */

import { DocumentPage, DocumentPageVisibility } from '../types';

export class DocumentPageDummy {
    static with(id: number): DocumentPage {
        return {
            id,
            creator: 9,
            created: '2022-08-15T11:47:57.000+00:00',
            modifier: null,
            modified: null,
            documentId: 145,
            categoryId: 29,
            parentId: null,
            validFrom: '2022-08-15T11:47:57.000+00:00',
            validTo: null,
            title: `Document Page Dummy ${id}`,
            slug: `document-page-dummy-${id}`,
            sort: 1,
            linkType: 'INTERNAL',
            linkUrl: null,
            viewCount: 0,
            visibility: DocumentPageVisibility.Everyone,
            changeProcessed: null,
            changeProcessedBy: null,
            changeSkipped: null,
            changeSkippedBy: null,
            changeComment: null,
            changeCommentBy: null,
            changeTitle: null,
        };
    }
}
