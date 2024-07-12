/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';

import { type AppBridgeTheme } from '../AppBridgeTheme.ts';

type UseLanguageReturn = {
    currentLanguage: string;
    defaultLanguage: string;
};

export const useLanguage = (appBridge: AppBridgeTheme): UseLanguageReturn => {
    const [currentLanguage, setCurrentLanguage] = useState(appBridge.context('currentLanguage').get());
    const [defaultLanguage, setDefaultLanguage] = useState(appBridge.context('defaultLanguage').get());

    useEffect(() => {
        const unsubscribeCurrentLanguageObserver = appBridge.context('currentLanguage').subscribe(setCurrentLanguage);
        const unsubscribeDefaultLanguageObserver = appBridge.context('defaultLanguage').subscribe(setDefaultLanguage);

        return () => {
            unsubscribeCurrentLanguageObserver();
            unsubscribeDefaultLanguageObserver();
        };
    }, [appBridge]);

    return { currentLanguage, defaultLanguage };
};
