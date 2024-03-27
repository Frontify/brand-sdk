/* (c) Copyright Frontify Ltd., all rights reserved. */

import {
    ChecklistBlock,
    ColorInputBlock,
    DropdownBlock,
    DynamicSettingBlock,
    InputBlock,
    MultiInputBlock,
    NotificationBlock,
    SectionHeadingBlock,
    SegmentedControlsBlock,
    SwitchBlock,
    TextareaBlock,
} from '@frontify/sidebar-settings';
import { type FC } from 'react';
import { AppBridgePlatformApp } from '@frontify/app-bridge';

export type PlatformAppSimpleBlock<AppBridge> =
    | ColorInputBlock<AppBridge>
    | ChecklistBlock<AppBridge>
    | DropdownBlock<AppBridge>
    | InputBlock<AppBridge>
    | MultiInputBlock<AppBridge>
    | NotificationBlock<AppBridge>
    | SectionHeadingBlock<AppBridge>
    | SegmentedControlsBlock<AppBridge>
    | SwitchBlock<AppBridge>
    | TextareaBlock<AppBridge>;

export type PlatformAppSettings =
    | PlatformAppSimpleBlock<AppBridgePlatformApp>
    | DynamicSettingBlock<AppBridgePlatformApp>;

export type PlatformAppSettingsStructureExport = { [customSectionName: string]: PlatformAppSettings[] };

export type PlatformAppConfigExport = {
    app: FC;
    settings: PlatformAppSettingsStructureExport;
};

/**
 * Type helper to export a platform-app, accepts a direct {@link PlatformAppConfigExport} object.
 */
export const defineApp = (config: PlatformAppConfigExport): PlatformAppConfigExport => config;

/**
 * Type helper to export platform-app settings structure, accepts a direct {@link PlatformAppSettingsStructureExport} object.
 */
export const defineSettings = (
    settingsStructure: PlatformAppSettingsStructureExport,
): PlatformAppSettingsStructureExport => settingsStructure;
