/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useCallback } from 'react';
import { useMultiFlyoutContext } from '../context/MultiFlyoutContext';

export const useMultiFlyoutState = (flyoutId: string) => {
    const { openFlyoutIds, setOpenFlyoutIds } = useMultiFlyoutContext();

    const onOpenChange = useCallback(
        (isFlyoutOpen: boolean) => {
            setOpenFlyoutIds((currentIds) => {
                const filteredIds = currentIds.filter((id) => id !== flyoutId);
                if (!isFlyoutOpen) {
                    return filteredIds;
                } else {
                    return [...filteredIds, flyoutId];
                }
            });
        },
        [flyoutId, setOpenFlyoutIds],
    );

    return { isOpen: openFlyoutIds.includes(flyoutId), onOpenChange };
};
