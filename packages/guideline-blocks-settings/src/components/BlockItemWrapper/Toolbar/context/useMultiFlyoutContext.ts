/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Dispatch, SetStateAction, createContext, useContext } from 'react';

export const MutliFlyoutContext = createContext<{
    openFlyoutIds: string[];
    setOpenFlyoutIds: Dispatch<SetStateAction<string[]>>;
}>({ openFlyoutIds: [], setOpenFlyoutIds: () => console.error('No MutliFlyoutContext Provider found') });

export const useMutliFlyoutContext = () => useContext(MutliFlyoutContext);
