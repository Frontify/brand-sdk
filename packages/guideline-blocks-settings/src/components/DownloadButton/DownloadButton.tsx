/* (c) Copyright Frontify Ltd., all rights reserved. */

import { Button, Tooltip } from '@frontify/fondue/components';
import { IconArrowCircleDown } from '@frontify/fondue/icons';

import { type DownloadButtonProps } from './types';

export const DownloadButton = ({ onDownload, ariaLabel }: DownloadButtonProps) => {
    return (
        <Tooltip.Root enterDelay={500}>
            <Tooltip.Trigger asChild>
                <Button
                    aria-label={ariaLabel ?? 'Download'}
                    onPress={onDownload}
                    data-test-id="download-button"
                    aspect="square"
                    emphasis="default"
                    rounding="full"
                    size="small"
                    type="button"
                    variant="default"
                    hugWidth
                >
                    <IconArrowCircleDown size={16} />
                </Button>
            </Tooltip.Trigger>
            <Tooltip.Content side="top">Download</Tooltip.Content>
        </Tooltip.Root>
    );
};
