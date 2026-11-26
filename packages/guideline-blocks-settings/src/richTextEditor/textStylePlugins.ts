/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type RtePlugin } from '@frontify/fondue/rich-text-editor';
import { type TextStylePluginOptions, quotePlugin, textStylePlugin } from '@frontify/fondue/rich-text-editor/plugins';

import { textStyleLook } from './looks';

const STYLES_WITHOUT_IMAGE: NonNullable<TextStylePluginOptions['styles']> = [
    'paragraph',
    'heading1',
    'heading2',
    'heading3',
    'heading4',
    'custom1',
    'custom2',
    'custom3',
];

const STYLES_WITH_IMAGE: NonNullable<TextStylePluginOptions['styles']> = [
    ...STYLES_WITHOUT_IMAGE,
    'imageTitle',
    'imageCaption',
];

export const TextStylePluginsWithoutImage: readonly RtePlugin[] = [
    textStylePlugin({ styles: STYLES_WITHOUT_IMAGE, look: textStyleLook }),
    quotePlugin(),
];

export const AllTextStylePlugins: readonly RtePlugin[] = [
    textStylePlugin({ styles: STYLES_WITH_IMAGE, look: textStyleLook }),
    quotePlugin(),
];
