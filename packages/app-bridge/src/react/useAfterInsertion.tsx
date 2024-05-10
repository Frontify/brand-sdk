/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect } from 'react';

import { type AppBridgeBlock } from '../AppBridgeBlock';

export const useAfterInsertion = <T extends AppBridgeBlock>(appBridge: T, callback: () => void, enabled = true) => {
    useEffect(() => {
        const isNew = appBridge.context('isNew').get();
        if (enabled && isNew) {
            callback();
        }
    }, [enabled, callback, appBridge]);

    return appBridge;
};
