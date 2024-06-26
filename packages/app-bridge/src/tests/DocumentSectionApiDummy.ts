/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type DocumentSectionApi } from '../types';

export class DocumentSectionApiDummy {
    static with(id: number): DocumentSectionApi {
        return {
            id,
            creator: 9,
            created: '2022-04-04T15:36:36.000+00:00',
            modifier: 9,
            modified: '2022-04-04T15:36:43.000+00:00',
            document_id: 1,
            page_id: 6,
            valid_to: null,
            title: `Document Section Dummy ${id}`,
            slug: `document-section-dummy-${id}`,
            sort: 1,
            permanent_link: `/r/document-section-${id}`,
        };
    }
    static withFields({ id, ...otherFields }: Partial<DocumentSectionApi>): DocumentSectionApi {
        return {
            ...DocumentSectionApiDummy.with(id ?? 1),
            ...otherFields,
        };
    }
}
