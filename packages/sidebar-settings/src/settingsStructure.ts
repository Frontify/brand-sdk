/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type ReactElement } from 'react';

import { type SettingBlock } from './blocks';

/**
 * Settings section rendered above the accordion with no header, label, or
 * icon. Reserved for a single "main" section per structure. Discriminated by
 * the literal `id: 'main'`.
 */
export type MainSection<AppBridge> = {
    id: 'main';
    blocks: SettingBlock<AppBridge>[];
};

/**
 * Settings section rendered as a labeled accordion item, with a human-readable
 * label and an optional leading icon.
 */
export type LabeledSection<AppBridge> = {
    /**
     * Stable identifier for the section. Must be unique within a structure.
     * Reserved value `'main'` selects the {@link MainSection} branch instead.
     */
    id: string;
    /**
     * Human-readable section label. Provided by the consuming theme/block,
     * typically translated via the {@link TranslatableSettingsStructure}
     * function form.
     */
    label: string;
    /**
     * Optional leading icon as a React element.
     */
    icon?: ReactElement;
    blocks: SettingBlock<AppBridge>[];
};

/**
 * A section in a settings structure. Discriminated by `id`: the literal
 * `'main'` selects {@link MainSection} (no header), any other id selects
 * {@link LabeledSection} (accordion item with label and optional icon).
 *
 * At most one section per structure should use `id: 'main'`. Multiple are
 * not type-prevented and should be handled defensively at the rendering
 * layer.
 */
export type SettingsSection<AppBridge> = MainSection<AppBridge> | LabeledSection<AppBridge>;
