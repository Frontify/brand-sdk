/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type DocumentSection, DocumentSectionDummy } from '@frontify/app-bridge';
import { describe, expect, it } from 'vitest';

import { filterDocumentSectionsWithUnreadableTitles } from './filterDocumentSectionsWithUnreadableTitles';

const documentSections = [
    { ...DocumentSectionDummy.with(244), title: null },
    { ...DocumentSectionDummy.with(345), title: 'New Title' },
    { ...DocumentSectionDummy.with(37675), title: ' ' },
    { ...DocumentSectionDummy.with(37575), title: '' },
] as DocumentSection[];

describe('filterDocumentSectionsWithUnreadableTitles', () => {
    it("should filter out document sections that don't have a readable title", () => {
        const sections = filterDocumentSectionsWithUnreadableTitles(documentSections);
        expect(sections).toEqual([documentSections[1]]);
    });
});
