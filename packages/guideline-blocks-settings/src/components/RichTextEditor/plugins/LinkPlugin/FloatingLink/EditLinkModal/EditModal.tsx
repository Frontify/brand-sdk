/* (c) Copyright Frontify Ltd., all rights reserved. */

import { IconPen, IconTrashBin } from '@frontify/fondue/icons';
import { FloatingModalWrapper, useLinkOpenButtonState } from '@frontify/fondue/rte';
import { type MouseEvent } from 'react';

import { getUrlFromLinkOrLegacyLink } from '../../../../../Link';
import { BlockStyles } from '../../../styles';
import { LINK_PLUGIN } from '../../id';

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
        <FloatingModalWrapper data-test-id="floating-link-edit" padding="16px" minWidth="400px">
            <span data-test-id="preview-link-flyout" className="tw-flex tw-justify-between tw-items-center tw-gap-2">
                <a
                    data-test-id="floating-link-edit-url"
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={BlockStyles[LINK_PLUGIN]}
                    className="tw-break-all"
                >
                    {url}
                </a>
                <span className="tw-flex tw-gap-2">
                    <button
                        tabIndex={0}
                        data-test-id="edit-link-button"
                        className="tw-transition tw-cursor-pointer tw-rounded hover:tw-bg-black-10 tw-p-1"
                        {...editButtonProps}
                    >
                        <IconPen size={16} />
                    </button>

                    <button
                        tabIndex={0}
                        data-test-id="remove-link-button"
                        className="tw-transition tw-cursor-pointer tw-rounded hover:tw-bg-black-10 tw-p-1"
                        {...unlinkButtonProps}
                    >
                        <IconTrashBin size={16} />
                    </button>
                </span>
            </span>
        </FloatingModalWrapper>
    );
};
