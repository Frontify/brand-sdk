/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect } from 'react';

import { type AppBridgeBlock } from '../AppBridgeBlock';

export const useAfterInsertion = <T extends AppBridgeBlock>(appBridge: T, callback: () => void, enabled = true) => {
    useEffect(() => {
        const isNewlyInserted = appBridge.context('isNewlyInserted').get();
        if (enabled && isNewlyInserted) {
            callback();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled, appBridge]);

    return appBridge;
};
