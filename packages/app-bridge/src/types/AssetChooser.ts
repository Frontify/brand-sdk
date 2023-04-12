/* (c) Copyright Frontify Ltd., all rights reserved. */

import { AssetChooserObjectType } from './Terrific';

export type AssetChooserFilter = {
    key: string;
    values?: string[] | number[] | AssetChooserObjectType[] | undefined;
    inverted?: boolean;
    containsText?: string;
};
