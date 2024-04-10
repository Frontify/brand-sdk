/* (c) Copyright Frontify Ltd., all rights reserved. */

import {
    type LinkFloatingToolbarState,
    type UseVirtualFloatingOptions,
    flip,
    offset,
    useFloatingLinkEdit,
    useFloatingLinkEditState,
    useFloatingLinkInsert,
    useFloatingLinkInsertState,
} from '@frontify/fondue';

import { EditModal } from './EditLinkModal';
import { InsertLinkModal } from './InsertLinkModal/InsertLinkModal';

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

export type LinkFloatingToolbarProps = {
    state?: LinkFloatingToolbarState;
};

export const CustomFloatingLink = () => {
    const insertState = useFloatingLinkInsertState({
        floatingOptions,
    });
    const { props: insertProps, ref: insertRef, hidden } = useFloatingLinkInsert(insertState);

    const editState = useFloatingLinkEditState({
        floatingOptions,
    });

    const { props: editProps, ref: editRef, editButtonProps, unlinkButtonProps } = useFloatingLinkEdit(editState);

    if (hidden) {
        return null;
    }

    const input = <InsertLinkModal />;
    const editContent = editState.isEditing ? (
        input
    ) : (
        <EditModal editButtonProps={editButtonProps} unlinkButtonProps={unlinkButtonProps} />
    );

    return (
        <>
            {insertState.isOpen && !editState.isOpen && (
                <div ref={insertRef} {...insertProps} style={{ ...insertProps.style, zIndex: 1000 }}>
                    {input}
                </div>
            )}

            {editState.isOpen && (
                <div ref={editRef} {...editProps} style={{ ...editProps.style, zIndex: 1000 }}>
                    {editContent}
                </div>
            )}
        </>
    );
};
