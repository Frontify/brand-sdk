/* (c) Copyright Frontify Ltd., all rights reserved. */

import { AppBridgeBlock } from '@frontify/app-bridge';
import {
    AlignCenterPlugin,
    AlignJustifyPlugin,
    AlignLeftPlugin,
    AlignRightPlugin,
    AutoformatPlugin,
    BoldPlugin,
    CheckboxListPlugin,
    CodePlugin,
    ItalicPlugin,
    OrderedListPlugin,
    PluginComposer,
    ResetFormattingPlugin,
    SoftBreakPlugin,
    StrikethroughPlugin,
    TextStylePlugin,
    UnderlinePlugin,
    UnorderedListPlugin,
} from '@frontify/fondue';
import { ButtonPlugin, LinkPlugin, TextStylePluginsWithoutImage, TextStylesWithoutImage } from '../plugins';

export const getDefaultPluginsWithLinkChooser = (appBridge: AppBridgeBlock) => {
    return new PluginComposer()
        .setPlugin(
            new SoftBreakPlugin(),
            new TextStylePlugin({
                textStyles: TextStylePluginsWithoutImage,
            }),
        )
        .setPlugin(
            [
                new BoldPlugin(),
                new ItalicPlugin(),
                new UnderlinePlugin(),
                new StrikethroughPlugin(),
                new LinkPlugin({ appBridge }),
                new ButtonPlugin({ appBridge }),
                new CodePlugin(),
            ],
            [
                new AlignLeftPlugin({ validTypes: TextStylesWithoutImage }),
                new AlignCenterPlugin({ validTypes: TextStylesWithoutImage }),
                new AlignRightPlugin({ validTypes: TextStylesWithoutImage }),
                new AlignJustifyPlugin({ validTypes: TextStylesWithoutImage }),
                new UnorderedListPlugin(),
                new CheckboxListPlugin(),
                new OrderedListPlugin(),
                new ResetFormattingPlugin(),
                new AutoformatPlugin(),
            ],
        );
};
