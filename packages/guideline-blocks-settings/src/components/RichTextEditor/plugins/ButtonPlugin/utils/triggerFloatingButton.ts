/* (c) Copyright Frontify Ltd., all rights reserved. */

import { PlateEditor } from '@udecode/plate-core';
import { Value } from '@udecode/slate';
import { floatingButtonSelectors } from '../components';
import { triggerFloatingButtonEdit, triggerFloatingButtonInsert } from '.';

export const triggerFloatingButton = <V extends Value>(
    editor: PlateEditor<V>,
    {
        focused,
    }: {
        focused?: boolean;
    } = {},
) => {
    if (floatingButtonSelectors.mode() === 'edit') {
        triggerFloatingButtonEdit(editor);
        return;
    }

    triggerFloatingButtonInsert(editor, {
        focused,
    });
};
