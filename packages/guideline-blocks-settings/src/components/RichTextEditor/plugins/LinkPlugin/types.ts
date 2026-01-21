/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type TLinkElement as TPlateLinkElement } from '@frontify/fondue/rte';

export type TLinkElement = TPlateLinkElement & {
    chosenLink?: {
        searchResult?: {
            link?: string;
        };
        openInNewTab?: boolean;
    };
};
