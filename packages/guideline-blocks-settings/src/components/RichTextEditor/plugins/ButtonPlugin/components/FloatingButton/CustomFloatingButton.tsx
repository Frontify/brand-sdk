/* (c) Copyright Frontify Ltd., all rights reserved. */

import { EditModal } from './EditButtonModal/EditModal';
import { FloatingButton } from './FloatingButton';
import { InsertButtonModal } from './InsertButtonModal/InsertButtonModal';
import { useFloatingButtonSelectors } from './floatingButtonStore';

export const CustomFloatingButton = () => {
    const isEditing = useFloatingButtonSelectors().isEditing();

    const input = <InsertButtonModal />;
    const editContent = isEditing ? input : <EditModal />;
    return (
        <>
            <FloatingButton.InsertRoot>{input}</FloatingButton.InsertRoot>
            <FloatingButton.EditRoot>{editContent}</FloatingButton.EditRoot>
        </>
    );
};
