/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type GuidelineSearchResult } from '../types';
import { convertObjectCase } from '../utilities';

import { GuidelineSearchResultApiDummy } from './GuidelineSearchResultApiDummy';

export class GuidelineSearchResultDummy {
    static with(query: string): GuidelineSearchResult {
        return convertObjectCase(GuidelineSearchResultApiDummy.with(query), 'camel');
    }
}
