/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type DocumentPageApi, DocumentPageVisibility } from '../types';

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
            targets: null,
            permanent_link: `/r/document-page-${id}`,
        };
    }

    static withFields(fields: Partial<DocumentPageApi> & { id: number }): DocumentPageApi {
        return {
            ...DocumentPageApiDummy.with(fields.id),
            ...fields,
        } as DocumentPageApi;
    }
}

export class DocumentPageDuplicateApiDummy {
    static with(id: number): DocumentPageDuplicateApiDummy {
        return {
            page: {
                id,
                link_type: 'INTERNAL',
                name: 'Document page duplicate dummy',
                sections: [],
                url: `document-page-duplicate-dummy-${id}`,
                visibility: 'EVERYONE',
            },
        };
    }
}
