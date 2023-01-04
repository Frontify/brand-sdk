/* (c) Copyright Frontify Ltd., all rights reserved. */

import { convertObjectCase } from '../utilities';
import { DocumentCategory } from '../types';

import { DocumentPageApiDummy } from './DocumentPageApiDummy';
import { DocumentCategoryApiDummy } from './DocumentCategoryApiDummy';

export class DocumentCategoryDummy {
    static with(id: number, documentPagesIds: number[]): DocumentCategory {
        return convertObjectCase(
            DocumentCategoryApiDummy.with(
                id,
                documentPagesIds.map((id) => DocumentPageApiDummy.with(id)),
            ),
            'camel',
        );
    }
}
