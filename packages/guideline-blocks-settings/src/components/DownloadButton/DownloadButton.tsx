/* (c) Copyright Frontify Ltd., all rights reserved. */

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
                    type="button"
                    tabIndex={0}
                    aria-label={ariaLabel ?? 'Download'}
                    {...focusProps}
                    className={joinClassNames([
                        'tw-outline-none tw-rounded-medium',
                        isFocused &&
                            'tw-ring-4 tw-ring-blue tw-ring-offset-2 dark:tw-ring-offset-black tw-outline-none',
                    ])}
                    onClick={onDownload}
                    onPointerDown={(e) => e.preventDefault()}
                    data-test-id="download-button"
                >
                    <span className="tw-flex tw-text-x-small tw-font-primary tw-items-center tw-gap-1 tw-rounded-full tw-bg-primary-on-primary hover:tw-bg-primary-on-primary active:tw-bg-primary-on-primary tw-text-primary tw-outline tw-outline-1 tw-outline-offset-1 tw-p-1.5 tw-outline-line-mid">
                        <IconArrowCircleDown size="16" />
                    </span>
                </button>
            </Tooltip.Trigger>
            <Tooltip.Content side="top">Download</Tooltip.Content>
        </Tooltip.Root>
    );
};
