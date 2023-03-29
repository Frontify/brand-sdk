/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { AssetInputSize } from '@frontify/fondue';
import type { AssetChooserObjectType, AssetChooserProjectType, FileExtension } from '.';
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
    extensions?: (FileExtension | string)[];
    projectTypes?: AssetChooserProjectType[];
    objectTypes?: AssetChooserObjectType[];
    mode?: LegacyAssetInputMode;
} & (
    | {
          /**
           * The size of the input.
           */
          size?: 'small' | 'large';
      }
    | {
          /**
           * The size of the input.
           * @deprecated Use string values instead.
           */
          size?: AssetInputSize;
      }
) &
    BaseBlock<AppBridge, LegacyAssetInputValue | LegacyAssetInputValue['value']>;
