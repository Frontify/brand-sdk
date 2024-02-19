/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { DocumentPage } from '../types';
import { convertObjectCase } from '../utilities';

import { DocumentPageApiDummy } from './DocumentPageApiDummy';

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
