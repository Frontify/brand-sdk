/* (c) Copyright Frontify Ltd., all rights reserved. */

import {
    AssetChooserFilter,
    AssetChooserObjectType,
    AssetChooserOptions,
    AssetChooserProjectType,
    FileExtension,
} from '../types';

export class AssetChooserOptionsDummy {
    static default(): { brandId: number; filters: AssetChooserFilter[] } & AssetChooserOptions {
        return {
            brandId: 1,
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
            filters: [
                {
                    key: 'id',
                    values: [1, 2, 3],
                    inverted: true,
                },
                {
                    key: 'id2',
                    values: [5, 6, 7],
                    inverted: true,
                },
                {
                    key: 'ext',
                    values: ['jpg', 'png', 'svg'],
                },
                {
                    key: 'object_type',
                    values: ['abc'],
                },
                {
                    key: 'external_url',
                    containsText: 'xyz',
                },
            ],
        };
    }

    static with(
        brandId: number,
        projectTypes: AssetChooserProjectType[],
        multiSelection: boolean,
        filters: AssetChooserFilter[],
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
