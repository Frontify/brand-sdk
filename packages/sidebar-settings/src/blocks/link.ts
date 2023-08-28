/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { BaseBlock } from './base';

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
     * @default false
     */
    openInNewTab?: boolean;

    /**
     * Whether the link chooser can be cleared or not.
     * @default false
     */
    clearable?: boolean;

    /**
     * Whether the internal link chooser is hidden.
     * @default false
     */
    hideInternalLinkButton?: boolean;
} & BaseBlock<AppBridge, { link: { link: string } | null; openInNewTab: boolean | null }>;
