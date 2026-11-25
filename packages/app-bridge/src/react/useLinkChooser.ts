/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useCallback, useEffect, useRef } from 'react';

import { type EventUnsubscribeFunction } from '../AppBridge';
import { type AppBridgeBlock } from '../AppBridgeBlock';
import { closeLinkChooser, openLinkChooser } from '../registries/commands/LinkChooser';
import { type LinkChooserOptions } from '../types';

type UseLinkChooserType = {
    openLinkChooser: (callback: (url: string) => void, options: LinkChooserOptions) => Promise<void>;
    closeLinkChooser: () => Promise<void>;
};

export const useLinkChooser = (appBridge: AppBridgeBlock): UseLinkChooserType => {
    const unsubscribeRef = useRef<EventUnsubscribeFunction>();

    useEffect(() => {
        return () => {
            unsubscribeRef.current?.();
            unsubscribeRef.current = undefined;
        };
    }, []);

    const handleOpenLinkChooser = useCallback(
        async (callback: (url: string) => void, options: LinkChooserOptions) => {
            unsubscribeRef.current?.();
            unsubscribeRef.current = appBridge.subscribe('linkChosen', (chosenLink) => {
                callback(chosenLink.url);
            });
            await appBridge.dispatch(openLinkChooser(options));
        },
        [appBridge],
    );

    const handleCloseLinkChooser = useCallback(async () => {
        unsubscribeRef.current?.();
        unsubscribeRef.current = undefined;
        await appBridge.dispatch(closeLinkChooser());
    }, [appBridge]);

    return {
        openLinkChooser: handleOpenLinkChooser,
        closeLinkChooser: handleCloseLinkChooser,
    };
};
