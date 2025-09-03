/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type Dispatch, type ReactNode, type SetStateAction, createContext, useContext, useMemo } from 'react';

export type MultiFlyoutContextType = {
    openFlyoutIds: string[];
    setOpenFlyoutIds: Dispatch<SetStateAction<string[]>>;
};

const MultiFlyoutContext = createContext<MultiFlyoutContextType>({
    openFlyoutIds: [],
    setOpenFlyoutIds: () => console.error('No MultiFlyoutContext Provider found'),
});
MultiFlyoutContext.displayName = 'MultiFlyoutContext';

export const MultiFlyoutContextProvider = ({
    children,
    openFlyoutIds,
    setOpenFlyoutIds,
}: { children: ReactNode } & MultiFlyoutContextType) => {
    const memoizedContext = useMemo(() => ({ openFlyoutIds, setOpenFlyoutIds }), [openFlyoutIds, setOpenFlyoutIds]);

    return <MultiFlyoutContext.Provider value={memoizedContext}>{children}</MultiFlyoutContext.Provider>;
};

export const useMultiFlyoutContext = () => useContext(MultiFlyoutContext);
