/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type AppBridgeBlock } from '@frontify/app-bridge';
import { type LinkSearch } from '@frontify/fondue/rich-text-editor/plugins';

export const createLinkSearch =
    (appBridge: AppBridgeBlock): LinkSearch =>
    async (query, signal) => {
        signal.throwIfAborted();

        const destinations = await appBridge.api({ name: 'getLinkDestinations', payload: { query } });

        signal.throwIfAborted();

        return destinations.map(({ id, title, permanentLink }) => ({ id, label: title, href: permanentLink }));
    };
