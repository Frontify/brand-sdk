/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useSyncExternalStore } from 'react';

import { type AppBridgeTheme } from '../AppBridgeTheme.ts';

type UseLanguageReturn = {
    currentLanguage: string;
    defaultLanguage: string;
};

export const useLanguage = (appBridge: AppBridgeTheme): UseLanguageReturn => {
    const currentLanguage = useSyncExternalStore(
        appBridge.context('currentLanguage').subscribe,
        appBridge.context('currentLanguage').get,
    );
    const defaultLanguage = useSyncExternalStore(
        appBridge.context('defaultLanguage').subscribe,
        appBridge.context('defaultLanguage').get,
    );

    return { currentLanguage, defaultLanguage };
};
