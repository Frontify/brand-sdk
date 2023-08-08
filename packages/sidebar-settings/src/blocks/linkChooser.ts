/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { SearchResult as SearchResultFondue } from '@frontify/fondue';
import type { BaseBlock } from './base';

export type SearchResult = SearchResultFondue;

export type LinkChooserBlock<AppBridge> = {
    /**
     * @deprecated Use `type: 'link'` instead.
     */
    type: 'linkChooser';

    /**
     * The placeholder text for the link chooser.
     */
    placeholder?: string;

    /**
     * Whether the link should be opened in a new tab or not.
     */
    openInNewTab?: boolean;

    /**
     * Whether the link chooser is disabled or not.
     */
    disabled?: boolean;

    /**
     * Whether the link chooser can be cleared or not.
     */
    clearable?: boolean;

    required?: boolean;
} & BaseBlock<AppBridge, { link: SearchResult | null; openInNewTab: boolean | null }>;
