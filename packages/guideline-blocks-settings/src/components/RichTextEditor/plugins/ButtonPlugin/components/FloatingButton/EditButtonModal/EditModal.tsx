/* (c) Copyright Frontify Ltd., all rights reserved. */

import { FloatingModalWrapper, IconPen16, IconTrashBin16, focusEditor, useEditorRef } from '@frontify/fondue';

import { LINK_PLUGIN } from '../../../../LinkPlugin/id';
import { BlockStyles } from '../../../../styles';
import { unwrapButton } from '../../../transforms';
import { triggerFloatingButtonEdit } from '../../../utils';
import { floatingButtonSelectors } from '../floatingButtonStore';

export const EditModal = () => {
    const editor = useEditorRef();
    return (
        <FloatingModalWrapper padding="16px" minWidth="400px" data-test-id="floating-button-edit">
            <span data-test-id="preview-button-flyout" className="tw-flex tw-justify-between tw-items-center tw-gap-2">
                <a
                    data-test-id="floating-button-edit-url"
                    href={floatingButtonSelectors.url()}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={BlockStyles[LINK_PLUGIN]}
                >
                    {floatingButtonSelectors.url()}
                </a>
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
        </FloatingModalWrapper>
    );
};
