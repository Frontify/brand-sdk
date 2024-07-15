/* (c) Copyright Frontify Ltd., all rights reserved. */

import { TextStyles, type UseVirtualFloatingOptions, flip, offset, useEditorRef } from '@frontify/fondue';
import { createPortal } from 'react-dom';

import { BlockStyles } from '../../../../../RichTextEditor/plugins/styles';
import { useFloatingButtonEdit, useFloatingButtonInsert, useFloatingButtonSelectors } from '../FloatingButton';

import { EditModal } from './EditButtonModal/EditModal';
import { InsertButtonModal } from './InsertButtonModal/InsertButtonModal';

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
            {isOpen &&
                mode === 'insert' &&
                createPortal(
                    <div
                        data-is-underlay
                        ref={insertRef}
                        {...insertProps}
                        style={{ ...insertProps.style, zIndex: 1000, ...BlockStyles[TextStyles.p] }}
                    >
                        {input}
                    </div>,
                    document.body,
                )}

            {isOpen &&
                mode === 'edit' &&
                createPortal(
                    <div
                        data-is-underlay
                        ref={editRef}
                        {...editProps}
                        style={{ ...editProps.style, zIndex: 1000, ...BlockStyles[TextStyles.p] }}
                    >
                        {editContent}
                    </div>,
                    document.body,
                )}
        </>
    );
};
