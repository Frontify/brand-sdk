/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type BaseBlock } from './base';

import { type AssetChooserObjectType, type AssetChooserProjectType, type AssetInputSize, type FileExtension } from '.';

export enum LegacyAssetInputSource {
    Library = 'Library',
    Upload = 'Upload',
}

export enum LegacyAssetInputMode {
    BrowseAndUpload = 'BrowseAndUpload',
    UploadOnly = 'UploadOnly',
    BrowseOnly = 'BrowseOnly',
}

export type LegacyAssetInputValue = {
    source: LegacyAssetInputSource;
    value: number;
};

export type LegacyAssetInputBlock<AppBridge> = {
    type: 'legacyAssetInput';
    multiSelection?: boolean;
    extensions?: (FileExtension | string)[];
    projectTypes?: AssetChooserProjectType[];
    objectTypes?: AssetChooserObjectType[];
    mode?: LegacyAssetInputMode;
    size?: 'small' | 'large' | AssetInputSize;
} & BaseBlock<AppBridge, LegacyAssetInputValue | LegacyAssetInputValue['value']>;
