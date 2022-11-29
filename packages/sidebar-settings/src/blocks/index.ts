/* (c) Copyright Frontify Ltd., all rights reserved. */

import type {
    AssetChooserObjectType as AssetChooserObjectTypeAppBridge,
    AssetChooserProjectType as AssetChooserProjectTypeAppBridge,
    FileExtension as FileExtensionAppBridge,
} from '@frontify/app-bridge';
import type { AssetInputSize as AssetInputSizeFondue, IconEnum as IconEnumFondue } from '@frontify/fondue';

import { AssetInputBlock } from './assetInput';
import { ChecklistBlock } from './checklist';
import { ColorInputBlock } from './colorInput';
import { DropdownBlock } from './dropdown';
import { InputBlock } from './input';
import { LegacyAssetInputBlock } from './legacyAssetInput';
import { LinkChooserBlock } from './linkChooser';
import { MultiInputBlock } from './multiInput';
import { NotificationBlock } from './notification';
import { SectionHeadingBlock } from './sectionHeading';
import { SliderBlock } from './slider';
import { SwitchBlock } from './switch';
import { TemplateInputBlock } from './templateInput';
import { TextareaBlock } from './textarea';

export * from './assetInput';
export * from './base';
export * from './checklist';
export * from './choices';
export * from './colorInput';
export * from './dropdown';
export * from './input';
export * from './legacyAssetInput';
export * from './linkChooser';
export * from './multiInput';
export * from './notification';
export * from './sectionHeading';
export * from './slider';
export * from './switch';
export * from './templateInput';
export * from './textarea';

export type AssetChooserObjectType = AssetChooserObjectTypeAppBridge;
export type AssetChooserProjectType = AssetChooserProjectTypeAppBridge;
export type FileExtension = FileExtensionAppBridge;
export type AssetInputSize = AssetInputSizeFondue;
export type IconEnum = IconEnumFondue;

export type SimpleSettingBlock<AppBridge> =
    | AssetInputBlock<AppBridge>
    | ChecklistBlock<AppBridge>
    | ColorInputBlock<AppBridge>
    | DropdownBlock<AppBridge>
    | InputBlock<AppBridge>
    | LegacyAssetInputBlock<AppBridge>
    | LinkChooserBlock<AppBridge>
    | MultiInputBlock<AppBridge>
    | NotificationBlock<AppBridge>
    | SectionHeadingBlock<AppBridge>
    | SliderBlock<AppBridge>
    | SwitchBlock<AppBridge>
    | TemplateInputBlock<AppBridge>
    | TextareaBlock<AppBridge>;

export type DynamicSupportedBlock<AppBridge> =
    | InputBlock<AppBridge>
    | ColorInputBlock<AppBridge>
    | DropdownBlock<AppBridge>;

export type DynamicSettingBlock<
    AppBridge,
    T extends DynamicSupportedBlock<AppBridge> = DynamicSupportedBlock<AppBridge>
> = Omit<T, 'value'> & {
    value?: DynamicSupportedBlock<AppBridge>['value'][];
    dynamic: {
        addButtonLabel: string;
    };
};

export type SettingBlock<AppBridge> = SimpleSettingBlock<AppBridge> | DynamicSettingBlock<AppBridge>;
