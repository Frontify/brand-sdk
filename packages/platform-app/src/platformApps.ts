/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { AppBridgePlatformApp } from '@frontify/app-bridge';
import type {
    ChecklistBlock as ChecklistBlockSidebarSettings,
    ChoicesType as ChoicesTypeSidebarSettings,
    ColorInputBlock as ColorInputBlockSidebarSettings,
    DropdownBlock as DropdownBlockSidebarSettings,
    InputBlock as InputBlockSidebarSettings,
    MultiInputBlock as MultiInputBlockSidebarSettings,
    NotificationBlock as NotificationBlockSidebarSettings,
    SectionHeadingBlock as SectionHeadingBlockSidebarSettings,
    SegmentedControlsBlock as SegmentedControlsBlockSidebarSettings,
    SettingBlock as SettingBlockSidebarSettings,
    SimpleSettingBlock as SimpleSettingBlockSidebarSettings,
    SwitchBlock as SwitchBlockSidebarSettings,
    TemplateInputBlock as TemplateInputBlockSidebarSettings,
    TextareaBlock as TextareaBlockSidebarSettings,
    ValueOrPromisedValue as ValueOrPromisedValueSidebarSettings,
} from '@frontify/sidebar-settings';
import { FC } from 'react';

export * from '@frontify/sidebar-settings';

export type ChecklistBlock = ChecklistBlockSidebarSettings<AppBridgePlatformApp>;
export type ChoicesType = ChoicesTypeSidebarSettings<AppBridgePlatformApp>;
export type ColorInputBlock = ColorInputBlockSidebarSettings<AppBridgePlatformApp>;
export type DropdownBlock = DropdownBlockSidebarSettings<AppBridgePlatformApp>;
export type InputBlock = InputBlockSidebarSettings<AppBridgePlatformApp>;
export type MultiInputBlock = MultiInputBlockSidebarSettings<AppBridgePlatformApp>;
export type NotificationBlock = NotificationBlockSidebarSettings<AppBridgePlatformApp>;
export type SectionHeadingBlock = SectionHeadingBlockSidebarSettings<AppBridgePlatformApp>;
export type SegmentedControlsBlock = SegmentedControlsBlockSidebarSettings<AppBridgePlatformApp>;
export type SettingBlock = SettingBlockSidebarSettings<AppBridgePlatformApp>;
export type SimpleSettingBlock = SimpleSettingBlockSidebarSettings<AppBridgePlatformApp>;
export type SwitchBlock = SwitchBlockSidebarSettings<AppBridgePlatformApp>;
export type TemplateInputBlock = TemplateInputBlockSidebarSettings<AppBridgePlatformApp>;
export type TextareaBlock = TextareaBlockSidebarSettings<AppBridgePlatformApp>;
export type ValueOrPromisedValue<T> = ValueOrPromisedValueSidebarSettings<AppBridgePlatformApp, T>;

export type PlatformAppSettingsStructureExport = { [customSectionName: string]: SettingBlock[] };

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
