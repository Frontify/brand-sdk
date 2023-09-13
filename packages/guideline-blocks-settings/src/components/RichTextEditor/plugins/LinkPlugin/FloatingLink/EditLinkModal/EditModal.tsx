/* (c) Copyright Frontify Ltd., all rights reserved. */

import { IconPen16, IconTrashBin16 } from '@frontify/fondue';
import { useFloatingLinkUrlInput } from '@udecode/plate';
import { FloatingLink } from '../FloatingLink';

export const EditModal = () => {
    const urlHtmlProps = useFloatingLinkUrlInput({});

    return (
        <div
            data-test-id="floating-link-edit"
            className="tw-bg-white tw-text-text tw-rounded tw-shadow tw-p-4 tw-min-w-[400px]"
        >
            <span data-test-id={'preview-link-flyout'} className="tw-flex tw-justify-between tw-items-center">
                <span className="tw-pointer-events-none">{urlHtmlProps.defaultValue}</span>
                <span className="tw-flex tw-gap-2">
                    <span
                        role="button"
                        tabIndex={0}
                        data-test-id={'edit-link-button'}
                        className="tw-transition tw-cursor-pointer tw-rounded hover:tw-bg-black-10 tw-p-1"
                    >
                        <FloatingLink.EditButton>
                            <IconPen16 />
                        </FloatingLink.EditButton>
                    </span>

                    <span
                        role="button"
                        tabIndex={0}
                        data-test-id={'remove-link-button'}
                        className="tw-transition tw-cursor-pointer tw-rounded hover:tw-bg-black-10 tw-p-1"
                    >
                        <FloatingLink.UnlinkButton>
                            <IconTrashBin16 />
                        </FloatingLink.UnlinkButton>
                    </span>
                </span>
            </span>
        </div>
    );
};
