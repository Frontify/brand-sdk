/* (c) Copyright Frontify Ltd., all rights reserved. */

import { FOCUS_STYLE } from '@frontify/fondue';
import { Tooltip } from '@frontify/fondue/components';
import { IconArrowCircleDown } from '@frontify/fondue/icons';
import { useFocusRing } from '@react-aria/focus';

import { joinClassNames } from '../../utilities';

import { type DownloadButtonProps } from './types';

export const DownloadButton = ({ onDownload, ariaLabel }: DownloadButtonProps) => {
    const { isFocused, focusProps } = useFocusRing();

    return (
        <Tooltip.Root enterDelay={500}>
            <Tooltip.Trigger asChild>
                <button
                    tabIndex={0}
                    aria-label={ariaLabel ?? 'Download'}
                    {...focusProps}
                    className={joinClassNames(['tw-outline-none tw-rounded', isFocused && FOCUS_STYLE])}
                    onClick={onDownload}
                    onPointerDown={(e) => e.preventDefault()}
                    data-test-id="download-button"
                >
                    <span className="tw-flex tw-text-xs tw-font-body tw-items-center tw-gap-1 tw-rounded-full tw-bg-box-neutral-strong-inverse hover:tw-bg-box-neutral-strong-inverse-hover active:tw-bg-box-neutral-strong-inverse-pressed tw-text-box-neutral-strong tw-outline tw-outline-1 tw-outline-offset-1 tw-p-1.5 tw-outline-line">
                        <IconArrowCircleDown size="16" />
                    </span>
                </button>
            </Tooltip.Trigger>
            <Tooltip.Content side="top">Download</Tooltip.Content>
        </Tooltip.Root>
    );
};
