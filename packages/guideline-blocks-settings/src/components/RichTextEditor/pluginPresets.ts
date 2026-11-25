/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type AppBridgeBlock } from '@frontify/app-bridge';
import { type RtePlugin } from '@frontify/fondue/rich-text-editor';
import {
    alignPlugin,
    boldPlugin,
    bulletListPlugin,
    checkListPlugin,
    codePlugin,
    historyPlugin,
    italicPlugin,
    numberedListPlugin,
    resetFormattingPlugin,
    softBreakPlugin,
    strikethroughPlugin,
    underlinePlugin,
} from '@frontify/fondue/rich-text-editor/plugins';

import { getLinkPlugin } from './linkPlugin';
import { bulletListLook, numberedListLook } from './looks';
import { AllTextStylePlugins, TextStylePluginsWithoutImage } from './textStylePlugins';

const LINK_KINDS_WITH_BUTTONS = ['text', 'button'] as const;

/**
 * The full editing set: text styles, marks, links and buttons with the guideline's link search, and lists.
 *
 * @example
 * <RichTextEditor isEditing plugins={getDefaultPluginsWithLinkChooser(appBridge)} />
 */
export const getDefaultPluginsWithLinkChooser = (appBridge: AppBridgeBlock): readonly RtePlugin[] => [
    historyPlugin(),
    softBreakPlugin(),
    ...TextStylePluginsWithoutImage,
    boldPlugin(),
    italicPlugin(),
    underlinePlugin(),
    strikethroughPlugin(),
    getLinkPlugin({ appBridge, kinds: LINK_KINDS_WITH_BUTTONS }),
    codePlugin(),
    alignPlugin(),
    bulletListPlugin({ look: bulletListLook }),
    checkListPlugin(),
    numberedListPlugin({ look: numberedListLook }),
    resetFormattingPlugin(),
];

/**
 * The short title set with no links. Pass `TextStylePluginsWithoutImage` to leave out the image styles.
 *
 * @example
 * <RichTextEditor isEditing plugins={getTitlePlugins(TextStylePluginsWithoutImage)} />
 */
export const getTitlePlugins = (textStylePlugins: readonly RtePlugin[] = AllTextStylePlugins): readonly RtePlugin[] => [
    historyPlugin(),
    softBreakPlugin(),
    ...textStylePlugins,
    boldPlugin(),
    italicPlugin(),
    underlinePlugin(),
    strikethroughPlugin(),
    alignPlugin(),
    resetFormattingPlugin(),
];
