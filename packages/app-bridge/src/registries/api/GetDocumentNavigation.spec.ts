/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';

import { getDocumentNavigation } from './GetDocumentNavigation';
import { GuidelineDocumentClass, GuidelineDocumentClassDummy } from '../../tests';

describe('GetDocumentNavigation', () => {
    it('should return correct method name', () => {
        const document = GuidelineDocumentClassDummy.with(101, 'document-101');

        const documentNavigationCall = getDocumentNavigation({ document });
        expect(documentNavigationCall.name).toBe('getDocumentNavigation');
    });

    it('should return correct payload', () => {
        const document = GuidelineDocumentClassDummy.with(101, 'document-101');

        const documentNavigationCall = getDocumentNavigation({ document });
        expect(documentNavigationCall.payload.document).toBeInstanceOf(GuidelineDocumentClass);
    });
});
