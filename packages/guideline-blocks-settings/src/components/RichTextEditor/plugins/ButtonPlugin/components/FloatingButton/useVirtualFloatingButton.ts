/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type UseVirtualFloatingOptions, flip, offset, useVirtualFloating } from '@frontify/fondue/rte';
import { type CSSProperties, type Ref } from 'react';

const OFFSET_Y = 12;
const OFFSET_X = -22;
const PADDING = 96;

export const useVirtualFloatingButton = (
    floatingOptions?: UseVirtualFloatingOptions,
): { style: CSSProperties; update: () => void; floating: Ref<HTMLDivElement> } =>
    useVirtualFloating({
        placement: 'bottom-start',
        middleware: [
            offset({
                mainAxis: OFFSET_Y,
                alignmentAxis: OFFSET_X,
            }),
            flip({
                padding: PADDING,
            }),
        ],
        ...floatingOptions,
    });
