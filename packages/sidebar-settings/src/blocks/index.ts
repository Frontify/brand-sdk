/* (c) Copyright Frontify Ltd., all rights reserved. */

import { AssetInputBlock } from './assetInput';
import { ChecklistBlock } from './checklist';
import { ColorInputBlock } from './colorInput';
import { DropdownBlock } from './dropdown';
import { FontInputBlock } from './fontInput';
import { InputBlock } from './input';
import { LegacyAssetInputBlock } from './legacyAssetInput';
import { LinkChooserBlock } from './linkChooser';
import { LinkBlock } from './link';
import { MultiInputBlock } from './multiInput';
import { NotificationBlock } from './notification';
import { SectionHeadingBlock } from './sectionHeading';
import { SegmentedControlsBlock } from './segmentedControls';
import { SwitchBlock } from './switch';
import { TemplateInputBlock } from './templateInput';
import { LegacyTemplateInputBlock } from './legacyTemplateInput';
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
export * from './segmentedControls';
export * from './switch';
export * from './templateInput';
export * from './legacyTemplateInput';
export * from './textarea';
export * from './link';

export {
    AssetChooserObjectType,
    AssetChooserProjectType,
    FileExtension,
    FileExtensionSets,
} from '@frontify/app-bridge';
export { IconEnum } from '@frontify/fondue';

/**
 * @deprecated
 */
export enum AssetInputSize {
    Small = 'Small',
    Large = 'Large',
}

/**
 * @deprecated
 */
export enum SwitchSize {
    Small = 'Small',
    Medium = 'Medium',
}

/**
 * @deprecated
 */
export enum MultiInputLayout {
    Columns = 'Columns',
    Spider = 'Spider',
}

/**
 * @deprecated
 */
export enum DropdownSize {
    Small = 'Small',
    Large = 'Large',
}

/**
 * @deprecated
 */
export enum TextInputType {
    Text = 'text',
    Password = 'password',
    Number = 'number',
}

export type SimpleSettingBlock<AppBridge> =
    | AssetInputBlock<AppBridge>
    | ChecklistBlock<AppBridge>
    | ColorInputBlock<AppBridge>
    | DropdownBlock<AppBridge>
    | FontInputBlock<AppBridge>
    | InputBlock<AppBridge>
    | LegacyAssetInputBlock<AppBridge>
    | LinkChooserBlock<AppBridge>
    | LinkBlock<AppBridge>
    | MultiInputBlock<AppBridge>
    | NotificationBlock<AppBridge>
    | SectionHeadingBlock<AppBridge>
    | SegmentedControlsBlock<AppBridge>
    | SwitchBlock<AppBridge>
    | TemplateInputBlock<AppBridge>
    | LegacyTemplateInputBlock<AppBridge>
    | TextareaBlock<AppBridge>;

export type DynamicSupportedBlock<AppBridge> =
    | InputBlock<AppBridge>
    | ColorInputBlock<AppBridge>
    | DropdownBlock<AppBridge>;

export type DynamicSettingBlock<
    AppBridge,
    T extends DynamicSupportedBlock<AppBridge> = DynamicSupportedBlock<AppBridge>,
> = UnionOmit<T, 'value'> & {
    value?: DynamicSupportedBlock<AppBridge>['value'][];
    dynamic: {
        addButtonLabel: string;
    };
};

export type SettingBlock<AppBridge> = SimpleSettingBlock<AppBridge> | DynamicSettingBlock<AppBridge>;
