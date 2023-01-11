/* (c) Copyright Frontify Ltd., all rights reserved. */

import { convertObjectCase } from '../utilities';
import type { DocumentCategory, DocumentPage } from '../types';

import { DocumentCategoryApiDummy } from './DocumentCategoryApiDummy';

export class DocumentCategoryDummy {
    static with(id: number, documentPages: DocumentPage[]): DocumentCategory {
        return convertObjectCase(DocumentCategoryApiDummy.with(id, convertObjectCase(documentPages, 'snake')), 'camel');
    }
}
