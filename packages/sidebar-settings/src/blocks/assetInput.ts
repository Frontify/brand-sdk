/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type BaseBlock } from './base';

import { type AssetChooserObjectType, type AssetChooserProjectType, type AssetInputSize, type FileExtension } from '.';

export enum AssetInputSource {
    Library = 'Library',
    Upload = 'Upload',
}

export enum AssetInputMode {
    BrowseAndUpload = 'BrowseAndUpload',
    UploadOnly = 'UploadOnly',
    BrowseOnly = 'BrowseOnly',
}

export type AssetInputValue = {
    source: AssetInputSource;
    value: number;
};

export type AssetInputBlock<AppBridge> = {
    /**
     * The setting type.
     */
    type: 'assetInput';

    /**
     * Whether multiple assets can be selected.
     */
    multiSelection?: boolean;

    /**
     * Allowed project types for the asset chooser.
     */
    projectTypes?: AssetChooserProjectType[];

    /**
     * Allowed object types for the asset chooser.
     */
    objectTypes?: AssetChooserObjectType[];

    /**
     * The mode of the asset input.
     *
     * It allows to restrict usage of upload and asset chooser.
     */
    mode?: AssetInputMode;

    /**
     * Whether the Delete option is present in the options dropdown
     */
    allowDelete?: boolean;

    /**
     * The size of the input.
     */
    size?: 'small' | 'large' | AssetInputSize;

    /**
     * The allowed file extensions to be uploaded.
     */
    extensions?: (FileExtension | string)[];

    /**
     * Whether the file size should be hidden or not.
     */
    hideSize?: boolean;

    /**
     * Whether the file extension should be hidden or not.
     */
    hideExtension?: boolean;
} & BaseBlock<AppBridge, AssetInputValue | AssetInputValue['value']>;
