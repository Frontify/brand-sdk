/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Dispatch, SetStateAction, createContext, useContext } from 'react';

export const ToolbarFlyoutContext = createContext<{
    openFlyoutIds: string[];
    setOpenFlyoutIds: Dispatch<SetStateAction<string[]>>;
}>({ openFlyoutIds: [], setOpenFlyoutIds: () => {} });

export const useToolbarFlyoutContext = () => useContext(ToolbarFlyoutContext);
