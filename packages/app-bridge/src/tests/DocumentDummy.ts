/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { Document } from '../types';
import { convertObjectCase } from '../utilities';

import { DocumentApiDummy } from './DocumentApiDummy';

export class DocumentDummy {
    static with(id: number): Document {
        return convertObjectCase(DocumentApiDummy.with(id), 'camel');
    }

    static withFields(fields: Document): Document {
        return {
            ...fields,
        };
    }
}
