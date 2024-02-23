/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type AppBridgePlatformApp } from '@frontify/app-bridge';
import {
    type ChecklistBlock as ChecklistBlockSettings,
    type ChoicesType as ChoicesTypeSettings,
    type ColorInputBlock as ColorInputBlockSettings,
    type DropdownBlock as DropdownBlockSettings,
    type InputBlock as InputBlockSettings,
    type MultiInputBlock as MultiInputBlockSettings,
    type NotificationBlock as NotificationBlockSettings,
    type SectionHeadingBlock as SectionHeadingBlockSettings,
    type SegmentedControlsBlock as SegmentedControlsBlockSettings,
    type SettingBlock as SettingBlockSettings,
    type SimpleSettingBlock as SimpleSettingBlockSettings,
    type SwitchBlock as SwitchBlockSettings,
    type TemplateInputBlock as TemplateInputBlockSettings,
    type TextareaBlock as TextareaBlockSettings,
    type ValueOrPromisedValue as ValueOrPromisedValueSettings,
} from '@frontify/sidebar-settings';
import { type FC } from 'react';

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
