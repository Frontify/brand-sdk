/* (c) Copyright Frontify Ltd., all rights reserved. */

import { convertObjectCase } from '../utilities';
import type { GuidelineSearchResult } from '../types';

import { GuidelineSearchResultApiDummy } from './GuidelineSearchResultApiDummy';

export class GuidelineSearchResultDummy {
    static with(query: string): GuidelineSearchResult {
        return convertObjectCase(GuidelineSearchResultApiDummy.with(query), 'camel');
    }
}
