/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type AssetInputBlock } from './assetInput';
import { type ChecklistBlock } from './checklist';
import { type ColorInputBlock } from './colorInput';
import { type DropdownBlock } from './dropdown';
import { type FontInputBlock } from './fontInput';
import { type InputBlock } from './input';
import { type LegacyAssetInputBlock } from './legacyAssetInput';
import { type LegacyTemplateInputBlock } from './legacyTemplateInput';
import { type LinkBlock } from './link';
import { type LinkChooserBlock } from './linkChooser';
import { type MultiInputBlock } from './multiInput';
import { type NotificationBlock } from './notification';
import { type SectionHeadingBlock } from './sectionHeading';
import { type SegmentedControlsBlock } from './segmentedControls';
import { type SwitchBlock } from './switch';
import { type TemplateInputBlock } from './templateInput';
import { type TextareaBlock } from './textarea';

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
