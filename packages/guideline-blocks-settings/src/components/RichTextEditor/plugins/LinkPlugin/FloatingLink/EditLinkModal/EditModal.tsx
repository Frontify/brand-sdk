/* (c) Copyright Frontify Ltd., all rights reserved. */

import { MouseEvent } from 'React';
import { useLinkOpenButtonState } from '@udecode/plate-link';
import { IconPen16, IconTrashBin16 } from '@frontify/fondue';
import { getUrlFromLinkOrLegacyLink } from '../../../../../Link';

type EditModalProps = {
    editButtonProps: {
        onClick: () => void;
    };
    unlinkButtonProps: {
        onMouseDown: (e: MouseEvent<HTMLButtonElement>) => void;
        onClick: () => void;
    };
};

export const EditModal = ({ editButtonProps, unlinkButtonProps }: EditModalProps) => {
    const { element } = useLinkOpenButtonState();
    const url = element ? getUrlFromLinkOrLegacyLink(element) : '';

    return (
        <div data-test-id="floating-link-edit" className="tw-bg-white tw-rounded tw-shadow tw-p-4 tw-min-w-[400px]">
            <span data-test-id={'preview-link-flyout'} className="tw-flex tw-justify-between tw-items-center">
                <span className="tw-pointer-events-none">{url}</span>
                <span className="tw-flex tw-gap-2">
                    <button
                        tabIndex={0}
                        data-test-id={'edit-link-button'}
                        className="tw-transition tw-cursor-pointer tw-rounded hover:tw-bg-black-10 tw-p-1"
                        {...editButtonProps}
                    >
                        <IconPen16 />
                    </button>

                    <button
                        tabIndex={0}
                        data-test-id={'remove-link-button'}
                        className="tw-transition tw-cursor-pointer tw-rounded hover:tw-bg-black-10 tw-p-1"
                        {...unlinkButtonProps}
                    >
                        <IconTrashBin16 />
                    </button>
                </span>
            </span>
        </div>
    );
};
