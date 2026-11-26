/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type PlateEditor, type Value } from '@frontify/fondue/rte';

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
