/* (c) Copyright Frontify Ltd., all rights reserved. */

import { InsertNodesOptions, TText, Value, insertNodes } from '@udecode/slate';
import { PlateEditor } from '@udecode/plate-core';
import { TButtonElement } from '../types';
import { CreateButtonNodeOptions, createButtonNode } from '../utils/index';

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
