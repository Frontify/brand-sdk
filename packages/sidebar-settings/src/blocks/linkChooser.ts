/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type BaseBlock } from './base';

export type SearchResult = {
    id: string | number;
    link?: string;
    icon: string;
    title: string;
    local?: boolean;
};

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
