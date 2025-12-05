/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type AppBridgeBlock } from '@frontify/app-bridge';
import {
    type PlatePlugin,
    Plugin,
    type PluginProps,
    createLinkPlugin as createPlateLinkPlugin,
    createPluginFactory,
} from '@frontify/fondue/rte';
import { type CSSProperties } from 'react';

import { isValidUrl } from '../../../Link';
import { BlockStyles } from '../styles';

import { CustomFloatingLink } from './FloatingLink/CustomFloatingLink';
import { LinkButton } from './LinkButton';
import { LinkMarkupElement } from './LinkMarkupElement';
import { LINK_PLUGIN } from './id';

export const createLinkPlugin = (appBridge: AppBridgeBlock): PlatePlugin =>
    createPluginFactory({
        ...createPlateLinkPlugin(),
        renderAfterEditable: CustomFloatingLink,
        options: {
            isUrl: isValidUrl,
            rangeBeforeOptions: {
                matchString: ' ',
                skipInvalid: true,
                afterMatch: true,
            },
            triggerFloatingLinkHotkeys: 'meta+k, ctrl+k',
            keepSelectedTextOnPaste: true,
            appBridge,
        },
    })();

export type LinkPluginProps = PluginProps & { appBridge: AppBridgeBlock };

export class LinkPlugin extends Plugin {
    public styles: CSSProperties = {};
    private appBridge: AppBridgeBlock;
    constructor({ styles = BlockStyles[LINK_PLUGIN], ...props }: LinkPluginProps) {
        super(LINK_PLUGIN, {
            button: LinkButton,
            markupElement: new LinkMarkupElement(),
            ...props,
        });
        this.styles = styles;
        this.appBridge = props.appBridge;
    }

    plugins(): PlatePlugin[] {
        return [createLinkPlugin(this.appBridge)];
    }
}
