/* (c) Copyright Frontify Ltd., all rights reserved. */

import { convertObjectCase } from '../utilities';
import type { DocumentCategory } from '../types';

import { DocumentCategoryApiDummy } from './DocumentCategoryApiDummy';

export class DocumentCategoryDummy {
    static with(id: number, documentPages: number[]): DocumentCategory {
        return { ...convertObjectCase(DocumentCategoryApiDummy.with(id), 'camel'), documentPages };
    }
}
