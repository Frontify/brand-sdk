/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type DocumentPage, type DocumentPageDuplicate, type DocumentPageDuplicateApi } from '../types';
import { convertObjectCase } from '../utilities';

import { DocumentPageApiDummy, DocumentPageDuplicateApiDummy } from './DocumentPageApiDummy';

export class DocumentPageDummy {
    static with(id: number): DocumentPage {
        return convertObjectCase(DocumentPageApiDummy.with(id), 'camel');
    }

    static withFields(fields: Partial<DocumentPage> & { id: number }): DocumentPage {
        return {
            ...DocumentPageDummy.with(fields.id),
            ...fields,
        } as DocumentPage;
    }
}

export class DocumentPageDuplicateDummy {
    static with(id: number): DocumentPageDuplicate {
        return convertObjectCase((DocumentPageDuplicateApiDummy.with(id) as DocumentPageDuplicateApi).page, 'camel');
    }
}
