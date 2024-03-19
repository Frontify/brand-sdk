/* (c) Copyright Frontify Ltd., all rights reserved. */

import { DocumentSection } from '../types';

export class DocumentSectionDummy {
    static with(id: number): DocumentSection {
        return {
            id,
            title: `Document Section Dummy ${id}`,
            slug: `document-section-dummy-${id}`,
            sort: 1,
            permanentLink: `/r/document-section-${id}`,
        };
    }
    static withFields(fields: Partial<DocumentSection>): DocumentSection {
        return {
            ...DocumentSectionDummy.with(1),
            ...fields,
        };
    }
}
