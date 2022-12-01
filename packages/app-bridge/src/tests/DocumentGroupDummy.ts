/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { Document, DocumentGroup } from '../types';

export class DocumentGroupDummy {
    static with(id: number, documents: Document[]): DocumentGroup {
        return {
            id,
            creator: 9,
            created: '2022-07-11 14:00:49',
            modified: '2022-08-15 07:59:28',
            modifier: 9,
            validTo: null,
            projectId: 113,
            portalId: 175,
            name: `Document Group Dummy ${id}`,
            sort: 1,
            documents,
        };
    }
}
