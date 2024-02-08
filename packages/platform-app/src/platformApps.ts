/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { AppBridgePlatformApp } from '@frontify/app-bridge';
import type {
    ChecklistBlock as ChecklistBlockSettings,
    ChoicesType as ChoicesTypeSettings,
    ColorInputBlock as ColorInputBlockSettings,
    DropdownBlock as DropdownBlockSettings,
    InputBlock as InputBlockSettings,
    MultiInputBlock as MultiInputBlockSettings,
    NotificationBlock as NotificationBlockSettings,
    SectionHeadingBlock as SectionHeadingBlockSettings,
    SegmentedControlsBlock as SegmentedControlsBlockSettings,
    SettingBlock as SettingBlockSettings,
    SimpleSettingBlock as SimpleSettingBlockSettings,
    SwitchBlock as SwitchBlockSettings,
    TemplateInputBlock as TemplateInputBlockSettings,
    TextareaBlock as TextareaBlockSettings,
    ValueOrPromisedValue as ValueOrPromisedValueSettings,
} from '@frontify/sidebar-settings';
import { FC } from 'react';

export * from '@frontify/sidebar-settings';

export type ChecklistBlock = ChecklistBlockSettings<AppBridgePlatformApp>;
export type ChoicesType = ChoicesTypeSettings<AppBridgePlatformApp>;
export type ColorInputBlock = ColorInputBlockSettings<AppBridgePlatformApp>;
export type DropdownBlock = DropdownBlockSettings<AppBridgePlatformApp>;
export type InputBlock = InputBlockSettings<AppBridgePlatformApp>;
export type MultiInputBlock = MultiInputBlockSettings<AppBridgePlatformApp>;
export type NotificationBlock = NotificationBlockSettings<AppBridgePlatformApp>;
export type SectionHeadingBlock = SectionHeadingBlockSettings<AppBridgePlatformApp>;
export type SegmentedControlsBlock = SegmentedControlsBlockSettings<AppBridgePlatformApp>;
export type SettingBlock = SettingBlockSettings<AppBridgePlatformApp>;
export type SimpleSettingBlock = SimpleSettingBlockSettings<AppBridgePlatformApp>;
export type SwitchBlock = SwitchBlockSettings<AppBridgePlatformApp>;
export type TemplateInputBlock = TemplateInputBlockSettings<AppBridgePlatformApp>;
export type TextareaBlock = TextareaBlockSettings<AppBridgePlatformApp>;
export type ValueOrPromisedValue<T> = ValueOrPromisedValueSettings<AppBridgePlatformApp, T>;

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
