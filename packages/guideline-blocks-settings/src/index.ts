/* (c) Copyright Frontify Ltd., all rights reserved. */

import './styles.css';
import { type AppBridgeBlock } from '@frontify/app-bridge';
import { type FC } from 'react';

import { type BlockProps, type SettingBlock } from './types';

export * from '@frontify/sidebar-settings';

export type {
    AssetInputBlock,
    BaseBlock,
    BlockProps,
    Bundle,
    ChecklistBlock,
    ChoicesType,
    ColorInputBlock,
    DropdownBlock,
    DynamicSettingBlock,
    DynamicSupportedBlock,
    FontInputBlock,
    InputBlock,
    LegacyAssetInputBlock,
    LinkBlock,
    LinkChooserBlock,
    MultiInputBlock,
    NotificationBlock,
    SectionHeadingBlock,
    SegmentedControlsBlock,
    SettingBlock,
    SimpleSettingBlock,
    SwitchBlock,
    TemplateInputBlock,
    TextareaBlock,
    ValueOrPromisedValue,
} from './types';

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

export type BlockConfigExport = {
    /**
     * Block component to render.
     * {@link https://developer.frontify.com/document/2569#/details-concepts-1/content-blocks}
     */
    block: FC<BlockProps>;
    /**
     * Contains the block settings and its structure.
     * {@link https://developer.frontify.com/document/2569#/details-concepts-1/block-settings-1}
     */
    settings: ReturnType<typeof defineSettings>;
    /**
     * Block lifecycle hook ran before the block gets added in the Guideline.
     * The hook support both synchronous or asynchronous execution.
     * {@link https://developer.frontify.com/document/2569#/details-concepts-1/block-lifecycle/on-block-creation}
     */
    onBlockCreated?:
        | (({ appBridge }: { appBridge: AppBridgeBlock }) => void)
        | (({ appBridge }: { appBridge: AppBridgeBlock }) => Promise<void>);
    /**
     * Block lifecycle hook ran before the block gets deleted from the Guideline.
     * The hook support both synchronous or asynchronous execution.
     * {@link https://developer.frontify.com/document/2569#/details-concepts-1/block-lifecycle/on-block-deletion}
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
