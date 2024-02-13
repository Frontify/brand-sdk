/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useCallback } from 'react';
import { useToolbarFlyoutContext } from '../context/useToolbarFlyoutContext';

export const useToolbarFlyoutState = (flyoutId: string) => {
    const { openFlyoutIds, setOpenFlyoutIds } = useToolbarFlyoutContext();

    const onOpenChange = useCallback(
        (isOpen: boolean) => {
            setOpenFlyoutIds((currentIds) => {
                const filteredIds = currentIds.filter((id) => id === flyoutId);
                if (isOpen) {
                    return [...filteredIds, flyoutId];
                } else {
                    return filteredIds;
                }
            });
        },
        [flyoutId, setOpenFlyoutIds],
    );

    return { isOpen: openFlyoutIds.includes(flyoutId), onOpenChange };
};
