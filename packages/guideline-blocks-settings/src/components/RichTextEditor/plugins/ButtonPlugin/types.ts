/* (c) Copyright Frontify Ltd., all rights reserved. */

import { TLinkElement } from '@frontify/fondue';

export type TButtonElement = TLinkElement & {
    chosenLink?: {
        searchResult?: {
            link?: string;
        };
    };
};

export type RichTextButtonStyle = 'primary' | 'secondary' | 'tertiary';
