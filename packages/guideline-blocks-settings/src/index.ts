/* (c) Copyright Frontify Ltd., all rights reserved. */

import './styles.css';

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
import { type FC } from 'react';

export * from '@frontify/sidebar-settings';

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

export enum Sections {
    Main = 'main',
    Basics = 'basics',
    Layout = 'layout',
    Style = 'style',
    Security = 'security',
    Targets = 'targets',
}

export type BlockSettingsStructureExport = {
    [Sections.Main]?: SettingBlock[];
    [Sections.Basics]?: SettingBlock[];
    [Sections.Layout]?: SettingBlock[];
    [Sections.Style]?: SettingBlock[];
    [Sections.Security]?: SettingBlock[];
} & { [customSectionName: string]: SettingBlock[] };

export type BlockProps = {
    /**
     * The Frontify App Bridge provides an interface to the Frontify app internals.
     * {@link https://developer.frontify.com/d/XFPCrGNrXQQM/content-blocks#/details-concepts-1/content-blocks/introducing-the-app-bridge}
     */
    appBridge: AppBridgeBlock;
};

export type BlockConfigExport = {
    /**
     * Block component to render.
     * {@link https://developer.frontify.com/d/XFPCrGNrXQQM/content-blocks#/details-concepts-1/content-blocks}
     */
    block: FC<BlockProps>;
    /**
     * Contains the block settings and its structure.
     * {@link https://developer.frontify.com/d/XFPCrGNrXQQM/content-blocks#/details-concepts-1/block-settings-1}
     */
    settings: ReturnType<typeof defineSettings>;
    /**
     * Block lifecycle hook ran before the block gets added in the Guideline.
     * The hook support both synchronous or asynchronous execution.
     * {@link https://developer.frontify.com/d/XFPCrGNrXQQM/content-blocks#/details-concepts-1/block-lifecycle/on-block-creation}
     */
    onBlockCreated?:
        | (({ appBridge }: { appBridge: AppBridgeBlock }) => void)
        | (({ appBridge }: { appBridge: AppBridgeBlock }) => Promise<void>);
    /**
     * Block lifecycle hook ran before the block gets deleted from the Guideline.
     * The hook support both synchronous or asynchronous execution.
     * {@link https://developer.frontify.com/d/XFPCrGNrXQQM/content-blocks#/details-concepts-1/block-lifecycle/on-block-deletion}
     */
    onBlockDeleted?:
        | (({ appBridge }: { appBridge: AppBridgeBlock }) => void)
        | (({ appBridge }: { appBridge: AppBridgeBlock }) => Promise<void>);
};

/**
 * Type helper to make it easier to export a theme, accepts a direct {@link BlockConfigExport} object.
 */
export const defineBlock = (config: BlockConfigExport): BlockConfigExport => config;

/**
 * Type helper to make it easier to export block's settings structure, accepts a direct {@link BlockSettingsStructureExport} object
 * or a function return a direct {@link BlockSettingsStructureExport} or a function returning a Promise of {@link BlockSettingsStructureExport}.
 */
export const defineSettings = <
    T extends
        | BlockSettingsStructureExport
        | (() => Promise<BlockSettingsStructureExport>)
        | (() => BlockSettingsStructureExport),
>(
    settingsStructure: T,
): T => settingsStructure;

export * from './components';
export * from './helpers';
export * from './hooks';
export * from './settings';
export * from './utilities';
