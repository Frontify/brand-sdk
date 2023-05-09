/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { DocumentPage, DocumentPageDuplicate, DocumentPageDuplicateApi } from '../types';
import { convertObjectCase } from '../utilities';

import { DocumentPageApiDummy, DocumentPageDuplicateApiDummy } from './DocumentPageApiDummy';

export class DocumentPageDummy {
    static with(id: number): DocumentPage {
        return convertObjectCase(DocumentPageApiDummy.with(id), 'camel');
    }

    static withDocumentAndDocumentCategoryId(
        id: number,
        documentId: number,
        documentCategoryId: number | null,
    ): DocumentPage {
        return convertObjectCase(
            DocumentPageApiDummy.withDocumentAndDocumentCategoryId(id, documentId, documentCategoryId),
            'camel',
        );
    }

    static withDocumentCategoryId(id: number, documentCategoryId: number | null): DocumentPage {
        return convertObjectCase(DocumentPageApiDummy.withDocumentCategoryId(id, documentCategoryId), 'camel');
    }

    static withFields(fields: DocumentPage): DocumentPage {
        return {
            ...fields,
        };
    }
}

export class DocumentPageDuplicateDummy {
    static with(id: number): DocumentPageDuplicate {
        return convertObjectCase((DocumentPageDuplicateApiDummy.with(id) as DocumentPageDuplicateApi).page, 'camel');
    }
}
