/* (c) Copyright Frontify Ltd., all rights reserved. */

import { PlateEditor, Value } from '@udecode/plate';
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
