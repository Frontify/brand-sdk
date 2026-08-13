/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type EventUnsubscribeFunction } from '../AppBridge';
import { type AppBridgeBlock } from '../AppBridgeBlock';
import { closeLinkChooser, openLinkChooser } from '../registries/commands/LinkChooser';
import { type LinkChooserOptions } from '../types';

type UseLinkChooserType = {
    openLinkChooser: (callback: (url: string) => void, options: LinkChooserOptions) => Promise<void>;
    closeLinkChooser: () => Promise<void>;
};

// oxlint-disable-next-line @eslint-react/no-unnecessary-use-prefix
export const useLinkChooser = (appBridge: AppBridgeBlock): UseLinkChooserType => {
    let unsubscribe: EventUnsubscribeFunction;

    return {
        openLinkChooser: async (callback, options) => {
            unsubscribe?.();
            unsubscribe = appBridge.subscribe('linkChosen', (chosenLink) => {
                callback(chosenLink.url);
            });
            await appBridge.dispatch(openLinkChooser(options));
        },
        closeLinkChooser: async () => {
            unsubscribe?.();
            await appBridge.dispatch(closeLinkChooser());
        },
    };
};
