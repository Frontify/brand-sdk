/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { AssetChooserObjectType, AssetChooserProjectType, AssetInputSize, FileExtension } from '.';
import type { BaseBlock } from './base';

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
    type: 'assetInput';
    multiSelection?: boolean;
    extensions?: (FileExtension | string)[];
    projectTypes?: AssetChooserProjectType[];
    objectTypes?: AssetChooserObjectType[];
    mode?: AssetInputMode;
    size?: AssetInputSize;
    hideExtension?: boolean;
    hideSize?: boolean;
} & BaseBlock<AppBridge, AssetInputValue | AssetInputValue['value']>;
