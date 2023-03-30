/* (c) Copyright Frontify Ltd., all rights reserved. */

import { DocumentSection } from '../types';

export class DocumentSectionDummy {
    static with(id: number): DocumentSection {
        return {
            id,
            title: `Document Section Dummy ${id}`,
            slug: `document-section-dummy-${id}`,
            sort: 1,
            permanentLink: '/r/document-section-1234',
        };
    }
}
