/* (c) Copyright Frontify Ltd., all rights reserved. */

import { AssetInputBlock } from './assetInput';
import { ChecklistBlock } from './checklist';
import { ColorInputBlock } from './colorInput';
import { DropdownBlock } from './dropdown';
import { FontInputBlock } from './fontInput';
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

type UnionOmit<T, K extends string | number | symbol> = T extends unknown ? Omit<T, K> : never;

export * from './assetInput';
export * from './base';
export * from './checkbox';
export * from './checklist';
export * from './choices';
export * from './colorInput';
export * from './dropdown';
export * from './fontInput';
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

export {
    AssetChooserObjectType,
    AssetChooserProjectType,
    FileExtension,
    FileExtensionSets,
} from '@frontify/app-bridge';
export {
    AssetInputSize,
    DropdownSize,
    IconEnum,
    MultiInputLayout,
    SwitchSize,
    TextInputType,
    Validation,
} from '@frontify/fondue';

export type SimpleSettingBlock<AppBridge> =
    | AssetInputBlock<AppBridge>
    | ChecklistBlock<AppBridge>
    | ColorInputBlock<AppBridge>
    | DropdownBlock<AppBridge>
    | FontInputBlock<AppBridge>
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
> = UnionOmit<T, 'value'> & {
    value?: DynamicSupportedBlock<AppBridge>['value'][];
    dynamic: {
        addButtonLabel: string;
    };
};

export type SettingBlock<AppBridge> = SimpleSettingBlock<AppBridge> | DynamicSettingBlock<AppBridge>;
