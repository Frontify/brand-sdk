/* (c) Copyright Frontify Ltd., all rights reserved. */

import { TextStyles } from '../styles';

import { Custom1Plugin } from './custom1Plugin';
import { Custom2Plugin } from './custom2Plugin';
import { Custom3Plugin } from './custom3Plugin';
import { Heading1Plugin } from './heading1Plugin';
import { Heading2Plugin } from './heading2Plugin';
import { Heading3Plugin } from './heading3Plugin';
import { Heading4Plugin } from './heading4Plugin';
import { ImageCaptionPlugin } from './imageCaptionPlugin';
import { ImageTitlePlugin } from './imageTitlePlugin';
import { ParagraphPlugin } from './paragraphPlugin';
import { QuotePlugin } from './quotePlugin';

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
