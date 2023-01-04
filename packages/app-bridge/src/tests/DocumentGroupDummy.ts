/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { DocumentGroup } from '../types';
import { convertObjectCase } from '../utilities';

import { DocumentApiDummy } from './DocumentApiDummy';
import { DocumentGroupApiDummy } from './DocumentGroupApiDummy';

export class DocumentGroupDummy {
    static with(id: number, documentIds: number[]): DocumentGroup {
        return convertObjectCase(
            DocumentGroupApiDummy.with(
                id,
                documentIds.map((documentId) => DocumentApiDummy.with(documentId)),
            ),
            'camel',
        );
    }
}
