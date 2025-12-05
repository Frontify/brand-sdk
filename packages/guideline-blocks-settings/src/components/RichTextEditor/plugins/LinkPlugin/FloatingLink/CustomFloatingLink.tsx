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
} from '@frontify/fondue/rte';
import { type CSSProperties } from 'react';
import { createPortal } from 'react-dom';

import { BlockStyles, TextStyles } from '../../../../RichTextEditor/plugins/styles';

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
            {insertState.isOpen &&
                !editState.isOpen &&
                createPortal(
                    <div
                        data-is-underlay
                        ref={insertRef}
                        {...insertProps}
                        style={{ ...(insertProps.style as CSSProperties), ...BlockStyles[TextStyles.p] }}
                    >
                        {input}
                    </div>,
                    document.body,
                )}

            {editState.isOpen &&
                createPortal(
                    <div
                        data-is-underlay
                        ref={editRef}
                        {...editProps}
                        style={{ ...(editProps.style as CSSProperties), ...BlockStyles[TextStyles.p] }}
                    >
                        {editContent}
                    </div>,
                    document.body,
                )}
        </>
    );
};
