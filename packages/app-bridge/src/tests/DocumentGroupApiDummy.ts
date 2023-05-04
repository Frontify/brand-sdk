/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { DocumentGroupApi } from '../types';

import { DocumentApiDummy } from './DocumentApiDummy';

export class DocumentGroupApiDummy {
    static with(id: number, documents: number[] = []): DocumentGroupApi {
        return {
            id,
            creator: 9,
            created: '2022-07-11 14:00:49',
            modified: '2022-08-15 07:59:28',
            modifier: 9,
            valid_to: null,
            project_id: 113,
            portal_id: 175,
            name: `Document Group Dummy ${id}`,
            sort: 1,
            documents: documents.map((document) => DocumentApiDummy.with(document)),
            number_of_documents: documents.length,
        };
    }
}
