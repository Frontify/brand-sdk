/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { SearchResult as SearchResultFondue, Validation as ValidationFondue } from '@frontify/fondue';
import type { BaseBlock } from './base';

export type SearchResult = SearchResultFondue;
export type Validation = ValidationFondue;

export type LinkChooserBlock<AppBridge> = {
    type: 'linkChooser';
    placeholder?: string;
    openInNewTab?: boolean;
    disabled?: boolean;
    clearable?: boolean;
    required?: boolean;
    validation?: Validation;
} & BaseBlock<AppBridge, { link: SearchResult | null; openInNewTab: boolean | null }>;
