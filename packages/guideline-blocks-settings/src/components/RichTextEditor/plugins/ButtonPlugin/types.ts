/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type TLinkElement } from '@frontify/fondue';

export type TButtonElement = TLinkElement & {
    chosenLink?: {
        searchResult?: {
            link?: string;
        };
    };
};

export type RichTextButtonStyle = 'primary' | 'secondary' | 'tertiary';
