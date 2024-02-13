/* (c) Copyright Frontify Ltd., all rights reserved. */

import { EditModal } from './EditButtonModal/EditModal';
import { InsertButtonModal } from './InsertButtonModal/InsertButtonModal';
import { UseVirtualFloatingOptions, flip, offset } from '@udecode/plate-floating';
import { useFloatingButtonEdit, useFloatingButtonInsert, useFloatingButtonSelectors } from '../FloatingButton';
import { useEditorRef } from '@udecode/plate-core';

const floatingOptions: UseVirtualFloatingOptions = {
    placement: 'bottom-start',
    strategy: 'absolute',
    middleware: [
        offset(12),
        flip({
            padding: 12,
            fallbackPlacements: ['bottom-end', 'top-start', 'top-end'],
        }),
    ],
};

export const CustomFloatingButton = () => {
    const { ref: insertRef, ...insertProps } = useFloatingButtonInsert(floatingOptions);
    const { ref: editRef, ...editProps } = useFloatingButtonEdit(floatingOptions);
    const editor = useEditorRef();
    const state = useFloatingButtonSelectors();
    const isOpen = state.isOpen(editor.id);
    const isEditing = state.isEditing();
    const mode = state.mode();

    const input = <InsertButtonModal />;
    const editContent = isEditing ? input : <EditModal />;

    return (
        <>
            {isOpen && mode === 'insert' && (
                <div ref={insertRef} {...insertProps}>
                    {input}
                </div>
            )}

            {isOpen && mode === 'edit' && (
                <div ref={editRef} {...editProps}>
                    {editContent}
                </div>
            )}
        </>
    );
};
