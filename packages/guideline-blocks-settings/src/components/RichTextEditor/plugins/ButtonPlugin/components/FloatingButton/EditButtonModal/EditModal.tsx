/* (c) Copyright Frontify Ltd., all rights reserved. */

import { IconPen, IconTrashBin } from '@frontify/fondue/icons';
import { FloatingModalWrapper, focusEditor, useEditorRef } from '@frontify/fondue/rte';

import { FloatingToolbarStyles } from '../../../../styles';
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
                    style={FloatingToolbarStyles.link}
                    className="tw-break-all"
                >
                    {floatingButtonSelectors.url()}
                </a>
                <span className="tw-flex tw-gap-2">
                    <button
                        type="button"
                        onClick={() => {
                            triggerFloatingButtonEdit(editor);
                        }}
                        tabIndex={0}
                        data-test-id="edit-button-button"
                        className="tw-transition tw-cursor-pointer tw-rounded-medium hover:tw-bg-surface-hover tw-p-1"
                    >
                        <IconPen size={16} />
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            unwrapButton(editor);
                            focusEditor(editor, editor.selection ?? undefined);
                        }}
                        tabIndex={0}
                        data-test-id="remove-button-button"
                        className="tw-transition tw-cursor-pointer tw-rounded-medium hover:tw-bg-surface-hover tw-p-1"
                    >
                        <IconTrashBin size={16} />
                    </button>
                </span>
            </span>
        </FloatingModalWrapper>
    );
};
