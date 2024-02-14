/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useMemo } from 'react';

type MutliFlyoutContextType = {
    openFlyoutIds: string[];
    setOpenFlyoutIds: Dispatch<SetStateAction<string[]>>;
};

const MutliFlyoutContext = createContext<MutliFlyoutContextType>({
    openFlyoutIds: [],
    setOpenFlyoutIds: () => console.error('No MutliFlyoutContext Provider found'),
});

export const MutliFlyoutContextProvider = ({
    children,
    openFlyoutIds,
    setOpenFlyoutIds,
}: { children: ReactNode } & MutliFlyoutContextType) => {
    const memoizedContext = useMemo(() => ({ openFlyoutIds, setOpenFlyoutIds }), [openFlyoutIds, setOpenFlyoutIds]);

    return <MutliFlyoutContext.Provider value={memoizedContext}>{children}</MutliFlyoutContext.Provider>;
};

export const useMutliFlyoutContext = () => useContext(MutliFlyoutContext);
