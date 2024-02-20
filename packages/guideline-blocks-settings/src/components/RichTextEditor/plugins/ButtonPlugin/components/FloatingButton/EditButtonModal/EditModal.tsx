/* (c) Copyright Frontify Ltd., all rights reserved. */

import { IconPen16, IconTrashBin16, focusEditor, useEditorRef } from '@frontify/fondue';

import { floatingButtonSelectors } from '../floatingButtonStore';
import { unwrapButton } from '../../../transforms';
import { triggerFloatingButtonEdit } from '../../../utils';

export const EditModal = () => {
    const editor = useEditorRef();
    return (
        <div
            data-test-id="floating-button-edit"
            className="tw-bg-white tw-text-text tw-rounded tw-shadow tw-p-4 tw-min-w-[400px]"
        >
            <span data-test-id="preview-button-flyout" className="tw-flex tw-justify-between tw-items-center">
                <span className="tw-pointer-events-none">{floatingButtonSelectors.url()}</span>
                <span className="tw-flex tw-gap-2">
                    <button
                        onClick={() => {
                            triggerFloatingButtonEdit(editor);
                        }}
                        tabIndex={0}
                        data-test-id="edit-button-button"
                        className="tw-transition tw-cursor-pointer tw-rounded hover:tw-bg-black-10 tw-p-1"
                    >
                        <IconPen16 />
                    </button>

                    <button
                        onClick={() => {
                            unwrapButton(editor);
                            focusEditor(editor, editor.selection ?? undefined);
                        }}
                        tabIndex={0}
                        data-test-id="remove-button-button"
                        className="tw-transition tw-cursor-pointer tw-rounded hover:tw-bg-black-10 tw-p-1"
                    >
                        <IconTrashBin16 />
                    </button>
                </span>
            </span>
        </div>
    );
};
