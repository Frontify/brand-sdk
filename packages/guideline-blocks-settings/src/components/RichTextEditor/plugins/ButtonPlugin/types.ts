/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type TLinkElement } from '@frontify/fondue/rte';

export type TButtonElement = TLinkElement & {
    chosenLink?: {
        searchResult?: {
            link?: string;
        };
    };
};

export type RichTextButtonStyle = 'primary' | 'secondary' | 'tertiary';
