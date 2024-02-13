/* (c) Copyright Frontify Ltd., all rights reserved. */

import { createContext, useContext } from 'react';

export const FlyoutCloseContext = createContext<() => void>(() => {});

export const useCloseFlyoutContext = () => useContext(FlyoutCloseContext);
