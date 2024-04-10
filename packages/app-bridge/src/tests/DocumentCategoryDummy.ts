/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type DocumentCategory } from '../types';
import { convertObjectCase } from '../utilities';

import { DocumentCategoryApiDummy } from './DocumentCategoryApiDummy';

export class DocumentCategoryDummy {
    static with(id: number): DocumentCategory {
        return convertObjectCase(DocumentCategoryApiDummy.with(id), 'camel');
    }

    static withDocumentIdAndNumberOfDocumentPages(
        id: number,
        documentId: number,
        numberOfDocumentPages: number,
    ): DocumentCategory {
        return convertObjectCase(
            DocumentCategoryApiDummy.withDocumentIdAndNumberOfDocumentPages(id, documentId, numberOfDocumentPages),
            'camel',
        );
    }

    static withFields(fields: DocumentCategory): DocumentCategory {
        return {
            ...fields,
        };
    }
}
