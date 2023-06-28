/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { SearchResult as SearchResultFondue } from '@frontify/fondue';
import type { BaseBlock } from './base';

export type SearchResult = SearchResultFondue;

export type LinkBlock<AppBridge> = {
    /**
     * The setting type.
     */
    type: 'link';

    /**
     * The placeholder text for the link chooser.
     */
    placeholder?: string;

    /**
     * Whether the link should be opened in a new tab or not.
     */
    openInNewTab?: boolean;

    /**
     * Whether the link chooser can be cleared or not.
     */
    clearable?: boolean;

    /**
     * Whether the internal link chooser is hidden.
     * @default false
     */
    hideInternalLinkButton?: boolean;
} & BaseBlock<AppBridge, { link: string | null; openInNewTab: boolean | null }>;
