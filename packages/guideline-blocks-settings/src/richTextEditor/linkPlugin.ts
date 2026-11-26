/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type AppBridgeBlock } from '@frontify/app-bridge';
import { type RtePlugin } from '@frontify/fondue/rich-text-editor';
import { type LinkPluginOptions, linkPlugin } from '@frontify/fondue/rich-text-editor/plugins';

import { createLinkSearch } from './linkSearch';
import { linkLook } from './looks';

export type GetLinkPluginOptions = { appBridge: AppBridgeBlock } & Pick<LinkPluginOptions, 'kinds'>;

/**
 * Links with the guideline's link search and the theme's link and button looks.
 * `kinds: ['text', 'button']` also offers the button styles.
 *
 * @example
 * const plugins = [getLinkPlugin({ appBridge, kinds: ['text', 'button'] })];
 */
export const getLinkPlugin = ({ appBridge, kinds }: GetLinkPluginOptions): RtePlugin =>
    linkPlugin({ search: createLinkSearch(appBridge), kinds, look: linkLook });
