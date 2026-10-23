/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type AppBridgeBlock } from '@frontify/app-bridge';
import {
    type AssetInputBlock as AssetInputBlockSidebarSettings,
    type BaseBlock as BaseBlockSidebarSettings,
    type Bundle as BundleSidebarSettings,
    type ChecklistBlock as ChecklistBlockSidebarSettings,
    type ChoicesType as ChoicesTypeSidebarSettings,
    type ColorInputBlock as ColorInputBlockSidebarSettings,
    type DropdownBlock as DropdownBlockSidebarSettings,
    type DynamicSettingBlock as DynamicSettingBlockSidebarSettings,
    type DynamicSupportedBlock as DynamicSupportedBlockSidebarSettings,
    type FontInputBlock as FontInputBlockSidebarSettings,
    type InputBlock as InputBlockSidebarSettings,
    type LegacyAssetInputBlock as LegacyAssetInputBlockSidebarSettings,
    type LinkBlock as LinkBlockSidebarSettings,
    type LinkChooserBlock as LinkChooserBlockSidebarSettings,
    type MultiInputBlock as MultiInputBlockSidebarSettings,
    type NotificationBlock as NotificationBlockSidebarSettings,
    type SectionHeadingBlock as SectionHeadingBlockSidebarSettings,
    type SegmentedControlsBlock as SegmentedControlsBlockSidebarSettings,
    type SettingBlock as SettingBlockSidebarSettings,
    type SimpleSettingBlock as SimpleSettingBlockSidebarSettings,
    type SwitchBlock as SwitchBlockSidebarSettings,
    type TemplateInputBlock as TemplateInputBlockSidebarSettings,
    type TextareaBlock as TextareaBlockSidebarSettings,
    type ValueOrPromisedValue as ValueOrPromisedValueSidebarSettings,
} from '@frontify/sidebar-settings';

export type AssetInputBlock = AssetInputBlockSidebarSettings<AppBridgeBlock>;
export type BaseBlock<T = undefined> = BaseBlockSidebarSettings<AppBridgeBlock, T>;
export type Bundle = BundleSidebarSettings<AppBridgeBlock>;
export type ChecklistBlock = ChecklistBlockSidebarSettings<AppBridgeBlock>;
export type ChoicesType = ChoicesTypeSidebarSettings<AppBridgeBlock>;
export type ColorInputBlock = ColorInputBlockSidebarSettings<AppBridgeBlock>;
export type DropdownBlock = DropdownBlockSidebarSettings<AppBridgeBlock>;
export type DynamicSettingBlock<Block extends DynamicSupportedBlock = DynamicSupportedBlock> =
    DynamicSettingBlockSidebarSettings<AppBridgeBlock, Block>;
export type DynamicSupportedBlock = DynamicSupportedBlockSidebarSettings<AppBridgeBlock>;
export type FontInputBlock = FontInputBlockSidebarSettings<AppBridgeBlock>;
export type InputBlock = InputBlockSidebarSettings<AppBridgeBlock>;
export type LegacyAssetInputBlock = LegacyAssetInputBlockSidebarSettings<AppBridgeBlock>;
export type LinkBlock = LinkBlockSidebarSettings<AppBridgeBlock>;
export type LinkChooserBlock = LinkChooserBlockSidebarSettings<AppBridgeBlock>;
export type MultiInputBlock = MultiInputBlockSidebarSettings<AppBridgeBlock>;
export type NotificationBlock = NotificationBlockSidebarSettings<AppBridgeBlock>;
export type SectionHeadingBlock = SectionHeadingBlockSidebarSettings<AppBridgeBlock>;
export type SegmentedControlsBlock = SegmentedControlsBlockSidebarSettings<AppBridgeBlock>;
export type SettingBlock = SettingBlockSidebarSettings<AppBridgeBlock>;
export type SimpleSettingBlock = SimpleSettingBlockSidebarSettings<AppBridgeBlock>;
export type SwitchBlock = SwitchBlockSidebarSettings<AppBridgeBlock>;
export type TemplateInputBlock = TemplateInputBlockSidebarSettings<AppBridgeBlock>;
export type TextareaBlock = TextareaBlockSidebarSettings<AppBridgeBlock>;
export type ValueOrPromisedValue<T> = ValueOrPromisedValueSidebarSettings<AppBridgeBlock, T>;

export type BlockProps = {
    /**
     * The Frontify App Bridge provides an interface to the Frontify app internals.
     * {@link https://developer.frontify.com/document/2569#/details-concepts-1/content-blocks/introducing-the-app-bridge}
     */
    appBridge: AppBridgeBlock;
};
