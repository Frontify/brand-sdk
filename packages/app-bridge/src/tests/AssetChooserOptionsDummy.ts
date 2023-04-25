/* (c) Copyright Frontify Ltd., all rights reserved. */

import { AssetChooserObjectType, AssetChooserOptions, AssetChooserProjectType, FileExtension } from '../types';

export class AssetChooserOptionsDummy {
    static default(): AssetChooserOptions {
        return {
            projectTypes: [
                AssetChooserProjectType.MediaLibrary,
                AssetChooserProjectType.LogoLibrary,
                AssetChooserProjectType.IconLibrary,
                AssetChooserProjectType.DocumentLibrary,
                AssetChooserProjectType.TemplateLibrary,
                AssetChooserProjectType.PatternLibrary,
                AssetChooserProjectType.Styleguide,
                AssetChooserProjectType.Workspace,
            ],
            objectTypes: [AssetChooserObjectType.Canvas],
            multiSelection: true,
        };
    }

    static with(
        projectTypes: AssetChooserProjectType[],
        multiSelection: boolean,
        objectTypes: AssetChooserObjectType[],
        extensions: FileExtension[],
    ): AssetChooserOptions {
        return {
            projectTypes,
            objectTypes,
            multiSelection: true,
            extensions,
        };
    }
}
