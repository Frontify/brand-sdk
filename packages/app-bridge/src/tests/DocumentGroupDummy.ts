/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { Document, DocumentGroup } from '../types';
import { convertObjectCase } from '../utilities';

import { DocumentGroupApiDummy } from './DocumentGroupApiDummy';

export class DocumentGroupDummy {
    static with(id: number, documents: Document[]): DocumentGroup {
        return convertObjectCase(DocumentGroupApiDummy.with(id, convertObjectCase(documents, 'snake')), 'camel');
    }
}
