/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type ReactNode, createContext, useContext } from 'react';

const DragPreviewContext = createContext(false);
DragPreviewContext.displayName = 'DragPreviewContext';

export const DragPreviewContextProvider = ({
    children,
    isDragPreview,
}: {
    children: ReactNode;
    isDragPreview: boolean;
}) => <DragPreviewContext.Provider value={isDragPreview}>{children}</DragPreviewContext.Provider>;

export const useDragPreviewContext = () => useContext(DragPreviewContext);
