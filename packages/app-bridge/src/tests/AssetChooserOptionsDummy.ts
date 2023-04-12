/* (c) Copyright Frontify Ltd., all rights reserved. */

import { AssetChooserObjectType, AssetChooserOptions, AssetChooserProjectType, FileExtension } from '../types';

export class AssetChooserOptionsDummy {
    static with(): AssetChooserOptions {
        return {
            projectTypes: AssetChooserProjectType.MediaLibrary,
            objectTypes: AssetChooserObjectType.Canvas,
            multiSelection: true,
            extensions: [FileExtension.JPEG, FileExtension.PNG],
        };
    }
}
