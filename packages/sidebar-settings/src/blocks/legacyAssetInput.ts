/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { AssetChooserObjectType, AssetChooserProjectType, AssetInputSize, FileExtension } from '.';
import type { BaseBlock } from './base';

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
    size?: 'small' | 'large' | AssetInputSize;
    extensions?: (FileExtension | string)[];
    projectTypes?: AssetChooserProjectType[];
    objectTypes?: AssetChooserObjectType[];
    mode?: LegacyAssetInputMode;
} & BaseBlock<AppBridge, LegacyAssetInputValue | LegacyAssetInputValue['value']>;
