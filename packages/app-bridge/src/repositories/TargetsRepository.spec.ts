/* (c) Copyright Frontify Ltd., all rights reserved. */

import { afterEach, describe, expect, test, vi } from 'vitest';

import {
    getDocumentPageTargets,
    getDocumentTargets,
    mapToDocumentPageTargets,
    mapToDocumentTargets,
} from './TargetsRepository';
import { DocumentPageTargetsApiDummy, DocumentTargetsApiDummy } from '../tests';
import { HttpClient } from '../utilities';

const DOCUMENT_ID = 1;
const PAGE_ID = 1;

describe('TargetsRepositoryTest', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    test('getDocumentTargets with success', async () => {
        const apiDocumentTargets = DocumentTargetsApiDummy.with(1);

        const mockHttpClientGet = vi.fn().mockReturnValue({ result: apiDocumentTargets });

        HttpClient.get = mockHttpClientGet;

        const result = await getDocumentTargets(DOCUMENT_ID);

        expect(mockHttpClientGet).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mapToDocumentTargets(apiDocumentTargets));
    });

    test('getPageTargets with success', async () => {
        const apiDocumentPageTargets = DocumentPageTargetsApiDummy.with(1);

        const mockHttpClientGet = vi.fn().mockReturnValue({ result: apiDocumentPageTargets });

        HttpClient.get = mockHttpClientGet;

        const result = await getDocumentPageTargets(PAGE_ID);

        expect(mockHttpClientGet).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mapToDocumentPageTargets(apiDocumentPageTargets));
    });
});
