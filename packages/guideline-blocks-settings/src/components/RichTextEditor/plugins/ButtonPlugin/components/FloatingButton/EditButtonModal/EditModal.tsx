/* (c) Copyright Frontify Ltd., all rights reserved. */

import { IconPen16, IconTrashBin16 } from '@frontify/fondue';
import { FloatingButton, useFloatingButtonUrlInput } from '..';

export const EditModal = () => {
    const urlHtmlProps = useFloatingButtonUrlInput({});

    return (
        <div
            data-test-id="floating-button-edit"
            className="tw-bg-white tw-text-text tw-rounded tw-shadow tw-p-4 tw-min-w-[400px]"
        >
            <span data-test-id="preview-button-flyout" className="tw-flex tw-justify-between tw-items-center">
                <span className="tw-pointer-events-none">{urlHtmlProps.defaultValue}</span>
                <span className="tw-flex tw-gap-2">
                    <span
                        role="button"
                        tabIndex={0}
                        data-test-id="edit-button-button"
                        className="tw-transition tw-cursor-pointer tw-rounded hover:tw-bg-black-10 tw-p-1"
                    >
                        <FloatingButton.EditButton>
                            <IconPen16 />
                        </FloatingButton.EditButton>
                    </span>

                    <span
                        role="button"
                        tabIndex={0}
                        data-test-id="remove-button-button"
                        className="tw-transition tw-cursor-pointer tw-rounded hover:tw-bg-black-10 tw-p-1"
                    >
                        <FloatingButton.UnlinkButton>
                            <IconTrashBin16 />
                        </FloatingButton.UnlinkButton>
                    </span>
                </span>
            </span>
        </div>
    );
};
