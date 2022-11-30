/* (c) Copyright Frontify Ltd., all rights reserved. */

import { DocumentPageApi, DocumentPageVisibility } from '../types';

export class DocumentPageApiDummy {
    static with(id: number): DocumentPageApi {
        return {
            id,
            creator: 9,
            created: '2022-08-15T11:47:57.000+00:00',
            modifier: null,
            modified: null,
            document_id: 145,
            category_id: 29,
            parent_id: null,
            valid_from: '2022-08-15T11:47:57.000+00:00',
            valid_to: null,
            title: `Document Page Dummy ${id}`,
            slug: `document-page-dummy-${id}`,
            sort: 1,
            link_type: 'INTERNAL',
            link_url: null,
            view_count: 0,
            visibility: DocumentPageVisibility.Everyone,
            change_processed: null,
            change_processed_by: null,
            change_skipped: null,
            change_skipped_by: null,
            change_comment: null,
            change_comment_by: null,
            change_title: null,
        };
    }
}
