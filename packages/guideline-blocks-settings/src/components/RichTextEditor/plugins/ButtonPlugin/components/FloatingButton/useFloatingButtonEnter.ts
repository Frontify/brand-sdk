/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEditorRef, useHotkeys } from '@frontify/fondue';

import { submitFloatingButton } from '../../transforms/submitFloatingButton';

export const useFloatingButtonEnter = () => {
    const editor = useEditorRef();

    useHotkeys(
        '*',
        (e) => {
            if (e.key === 'Enter' && submitFloatingButton(editor)) {
                e.preventDefault();
            }
        },
        {
            enableOnFormTags: ['INPUT'],
        },
        [],
    );
};
