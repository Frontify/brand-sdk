/* (c) Copyright Frontify Ltd., all rights reserved. */

import { AssetChooserObjectType, type AssetChooserOptions, AssetChooserProjectType, FileExtension } from '../types';

export class AssetChooserOptionsDummy {
    static default(): AssetChooserOptions {
        return {
            projectTypes: Object.values(AssetChooserProjectType),
            objectTypes: [AssetChooserObjectType.Canvas],
            extensions: [FileExtension.Jpg, FileExtension.Png, FileExtension.Svg],
            multiSelection: true,
            urlContains: 'abc.xyz',
        };
    }

    static withSingleSelectedValue(selectedValueId?: number): AssetChooserOptions {
        return {
            ...this.default(),
            multiSelection: false,
            selectedValueId,
        };
    }

    static withMultiSelectedValues(selectedValueIds?: number[]): AssetChooserOptions {
        return {
            ...this.default(),
            multiSelection: true,
            selectedValueIds,
        };
    }
}
