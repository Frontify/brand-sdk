/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { AppBridgeBlock } from '@frontify/app-bridge';
import type { Bundle as BundleSidebarSettings, SettingBlock } from '@frontify/sidebar-settings';
import type { FC } from 'react';

export * from '@frontify/sidebar-settings';

export type Bundle = BundleSidebarSettings<AppBridgeBlock>;

export enum Sections {
    Main = 'main',
    Basics = 'basics',
    Layout = 'layout',
    Style = 'style',
    Security = 'security',
    Targets = 'targets',
}

export type BlockSettingsStructureExport = {
    [Sections.Main]?: SettingBlock<AppBridgeBlock>[];
    [Sections.Basics]?: SettingBlock<AppBridgeBlock>[];
    [Sections.Layout]?: SettingBlock<AppBridgeBlock>[];
    [Sections.Style]?: SettingBlock<AppBridgeBlock>[];
    [Sections.Security]?: SettingBlock<AppBridgeBlock>[];
};

export type BlockProps = {
    appBridge: AppBridgeBlock;
};

export type BlockConfigExport = {
    block: FC<BlockProps>;
    settings: ReturnType<typeof defineSettings>;
    onBlockCreated?:
        | (({ appBridge }: { appBridge: AppBridgeBlock }) => void)
        | (({ appBridge }: { appBridge: AppBridgeBlock }) => Promise<void>);
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
