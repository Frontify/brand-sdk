/* (c) Copyright Frontify Ltd., all rights reserved. */

import { afterEach, describe, expect, test, vi } from 'vitest';

import { getCoverPage, mapToCoverPage } from './CoverPageRepository';
import { CoverPageApiDummy } from '../tests';
import { HttpClient } from '../utilities';

const COVER_PAGE_ID = 1;
const HUB_ID = 1;

describe('CoverPageRepositoryTest', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    test('getCoverPage with success', async () => {
        const apiCoverPage = CoverPageApiDummy.with(COVER_PAGE_ID);

        const mockHttpClientGet = vi.fn().mockReturnValue({ result: apiCoverPage });

        HttpClient.get = mockHttpClientGet;

        const result = await getCoverPage(HUB_ID);

        expect(mockHttpClientGet).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mapToCoverPage(apiCoverPage));
    });
});
