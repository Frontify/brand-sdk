/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type DocumentSection } from '../types';

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
    static withFields({ id, ...otherFields }: Partial<DocumentSection>): DocumentSection {
        return {
            ...DocumentSectionDummy.with(id ?? 1),
            ...otherFields,
        };
    }
}
