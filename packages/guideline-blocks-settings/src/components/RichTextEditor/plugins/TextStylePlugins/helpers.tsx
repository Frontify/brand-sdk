/* (c) Copyright Frontify Ltd., all rights reserved. */

import {
    Custom1Plugin,
    Custom2Plugin,
    Custom3Plugin,
    Heading1Plugin,
    Heading2Plugin,
    Heading3Plugin,
    Heading4Plugin,
    ImageCaptionPlugin,
    ImageTitlePlugin,
    ParagraphPlugin,
    QuotePlugin,
} from '.';
import { TextStyles } from '../styles';

export const TextStylePluginsWithoutImage = [
    new Heading1Plugin(),
    new Heading2Plugin(),
    new Heading3Plugin(),
    new Heading4Plugin(),
    new Custom1Plugin(),
    new Custom2Plugin(),
    new Custom3Plugin(),
    new QuotePlugin(),
    new ParagraphPlugin(),
];

export const TextStylesWithoutImage = [
    TextStyles.heading1,
    TextStyles.heading2,
    TextStyles.heading3,
    TextStyles.heading4,
    TextStyles.custom1,
    TextStyles.custom2,
    TextStyles.custom3,
    TextStyles.quote,
    TextStyles.p,
];

export const AllTextStylePlugins = [...TextStylePluginsWithoutImage, new ImageCaptionPlugin(), new ImageTitlePlugin()];

export const AllTextStyles = [...TextStylesWithoutImage, TextStyles.imageCaption, TextStyles.imageTitle];
