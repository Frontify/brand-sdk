/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { BrandportalI18nLanguage } from '../types';

export class BrandportalI18nLanguageDummy {
    static with(language?: BrandportalI18nLanguage): BrandportalI18nLanguage {
        return language ?? { language: 'en', label: 'English', default: true, draft: false };
    }
}
