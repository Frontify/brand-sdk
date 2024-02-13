/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useCallback } from 'react';
import { useToolbarFlyoutContext } from '../context/useToolbarFlyoutContext';

export const useToolbarFlyoutState = (flyoutId: string) => {
    const { openFlyoutIds, setOpenFlyoutIds } = useToolbarFlyoutContext();

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
