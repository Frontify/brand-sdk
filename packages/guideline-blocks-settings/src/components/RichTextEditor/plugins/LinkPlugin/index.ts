/* (c) Copyright Frontify Ltd., all rights reserved. */

import { CSSProperties } from 'react';
import { AppBridgeBlock } from '@frontify/app-bridge';
import { createLinkPlugin as createPlateLinkPlugin } from '@udecode/plate-link';
import { PlatePlugin, createPluginFactory } from '@udecode/plate-core';
import { Plugin, PluginProps } from '@frontify/fondue';

import { CustomFloatingLink } from './FloatingLink/CustomFloatingLink';
import { LINK_PLUGIN } from './id';
import { LinkButton } from './LinkButton';
import { LinkMarkupElement } from './LinkMarkupElement';
import { BlockStyles } from '../styles';
import { isValidUrl } from '../../../Link';

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
