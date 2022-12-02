/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { FC } from 'react';
import type { AppBridgeBlock } from '@frontify/app-bridge';
import type {
    Bundle as BundleSidebarSettings,
    SettingBlock as SettingBlockSidebarSettings,
} from '@frontify/sidebar-settings';

export * from '@frontify/sidebar-settings';

export type Bundle = BundleSidebarSettings<AppBridgeBlock>;
export type SettingBlock = SettingBlockSidebarSettings<AppBridgeBlock>;

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
     * {@link https://developer.frontify.com/document/1366#/details-concepts/content-blocks/introducing-the-appbridge}
     */
    appBridge: AppBridgeBlock;
};

export type BlockConfigExport = {
    /**
     * Block component to render.
     * {@link https://developer.frontify.com/document/1366#/details-concepts/content-blocks}
     */
    block: FC<BlockProps>;
    /**
     * Contains the block settings and its structure.
     * {@link https://developer.frontify.com/document/1366#/details-concepts/block-settings}
     */
    settings: ReturnType<typeof defineSettings>;
    /**
     * Block lifecycle hook ran before the block gets added in the Guideline.
     * The hook support both synchronous or asynchronous execution.
     * {@link https://developer.frontify.com/document/1366#/details-concepts/new-block-lifecycle/on-block-creation}
     */
    onBlockCreated?:
        | (({ appBridge }: { appBridge: AppBridgeBlock }) => void)
        | (({ appBridge }: { appBridge: AppBridgeBlock }) => Promise<void>);
    /**
     * Block lifecycle hook ran before the block gets deleted from the Guideline.
     * The hook support both synchronous or asynchronous execution.
     * {@link https://developer.frontify.com/document/1366#/details-concepts/new-block-lifecycle/on-block-deletion}
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
 * Type helper to make it easier to export block's settings structure, accepts a direct {@link BlockSettingsStructureExport} object.
 */
export const defineSettings = (settingsStructure: BlockSettingsStructureExport): BlockSettingsStructureExport =>
    settingsStructure;
