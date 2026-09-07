/* (c) Copyright Frontify Ltd., all rights reserved. */

import { TextStyles, type UseVirtualFloatingOptions, flip, offset, useEditorRef } from '@frontify/fondue/rte';
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

    /*
     * `zIndex: 'auto'` is asserted deliberately: these modals are portaled to `document.body`
     * and must stay ordered by DOM position, so a dialog opened from them (e.g. the guideline
     * LinkChooser) renders on top. Guideline portals can carry custom CSS that sets a z-index
     * on body children, which would otherwise lift this above that dialog. Inline styles win
     * over those rules, so do not remove it.
     */
    return (
        <>
            {isOpen &&
                mode === 'insert' &&
                createPortal(
                    <div
                        data-is-underlay
                        ref={insertRef}
                        {...insertProps}
                        style={{ ...insertProps.style, ...BlockStyles[TextStyles.p], zIndex: 'auto' }}
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
                        style={{ ...editProps.style, ...BlockStyles[TextStyles.p], zIndex: 'auto' }}
                    >
                        {editContent}
                    </div>,
                    document.body,
                )}
        </>
    );
};
