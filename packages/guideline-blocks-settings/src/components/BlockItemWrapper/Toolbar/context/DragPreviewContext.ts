/* (c) Copyright Frontify Ltd., all rights reserved. */

import { createContext, useContext } from 'react';

export const DragPreviewContext = createContext(false);

export const useDragPreviewContext = () => useContext(DragPreviewContext);
