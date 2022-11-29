/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { SearchResult as SearchResultFondue } from '@frontify/fondue';
import type { BaseBlock } from './base';
import type { Validation } from '.';

export type SearchResult = SearchResultFondue;

export type LinkChooserBlock<AppBridge> = {
    type: 'linkChooser';
    placeholder?: string;
    openInNewTab?: boolean;
    disabled?: boolean;
    clearable?: boolean;
    required?: boolean;
    validation?: Validation;
} & BaseBlock<AppBridge, { link: SearchResult | null; openInNewTab: boolean | null }>;
