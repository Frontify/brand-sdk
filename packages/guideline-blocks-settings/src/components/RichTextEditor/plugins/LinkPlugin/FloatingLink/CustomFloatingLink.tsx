/* (c) Copyright Frontify Ltd., all rights reserved. */

import {
    type LinkFloatingToolbarState,
    type UseVirtualFloatingOptions,
    flip,
    floatingLinkSelectors,
    offset,
    useFloatingLinkEdit,
    useFloatingLinkEditState,
    useFloatingLinkInsert,
    useFloatingLinkInsertState,
} from '@frontify/fondue/rte';
import { type CSSProperties } from 'react';
import { createPortal } from 'react-dom';

import { BlockStyles, TextStyles } from '../../../../RichTextEditor/plugins/styles';
import { useScopedThemeVariables } from '../../useScopedThemeVariables';

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
    const isModalVisible = (insertState.isOpen && floatingLinkSelectors.mode() === 'insert') || editState.isOpen;
    const { anchorRef, themeVariables } = useScopedThemeVariables(isModalVisible);

    if (hidden) {
        return <span ref={anchorRef} style={{ display: 'none' }} />;
    }

    const input = <InsertLinkModal />;
    const editContent = editState.isEditing ? (
        input
    ) : (
        <EditModal editButtonProps={editButtonProps} unlinkButtonProps={unlinkButtonProps} />
    );

    return (
        <>
            <span ref={anchorRef} style={{ display: 'none' }} />
            {insertState.isOpen &&
                !editState.isOpen &&
                createPortal(
                    <div
                        data-is-underlay
                        ref={insertRef}
                        {...insertProps}
                        style={{
                            ...themeVariables,
                            ...(insertProps.style as CSSProperties),
                            ...BlockStyles[TextStyles.p],
                        }}
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
                        style={{
                            ...themeVariables,
                            ...(editProps.style as CSSProperties),
                            ...BlockStyles[TextStyles.p],
                        }}
                    >
                        {editContent}
                    </div>,
                    document.body,
                )}
        </>
    );
};
