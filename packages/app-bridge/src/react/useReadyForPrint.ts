/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';

import { type AppBridgeBlock } from '../AppBridgeBlock';

export const useReadyForPrint = (
    appBridge: AppBridgeBlock,
): {
    isReadyForPrint: boolean;
    setIsReadyForPrint: (isReady: boolean) => void;
} => {
    const [ready, setReady] = useState<boolean>(false);

    useEffect(() => {
        const blockWrapper = document.querySelector(`.block[data-block="${appBridge.context('blockId').get()}"]`);

        if (!blockWrapper) {
            console.error('Could not find block wrapper:', appBridge.context('blockId').get());
            return;
        }

        blockWrapper.setAttribute('data-ready', ready.toString());
    }, [appBridge, ready]);

    const setIsReadyForPrint = (isReady: boolean) => {
        setReady(isReady);
    };

    return { isReadyForPrint: ready, setIsReadyForPrint };
};
