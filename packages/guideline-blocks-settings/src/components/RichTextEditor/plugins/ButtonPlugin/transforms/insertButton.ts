/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type InsertNodesOptions, type PlateEditor, type TText, type Value, insertNodes } from '@frontify/fondue/rte';

import { type TButtonElement } from '../types';
import { type CreateButtonNodeOptions, createButtonNode } from '../utils/index';

export const insertButton = <V extends Value>(
    editor: PlateEditor<V>,
    createButtonNodeOptions: CreateButtonNodeOptions,
    options?: InsertNodesOptions<V>,
) => {
    insertNodes<TButtonElement | TText>(
        editor,
        [createButtonNode(editor, createButtonNodeOptions)],
        options as InsertNodesOptions,
    );
};
