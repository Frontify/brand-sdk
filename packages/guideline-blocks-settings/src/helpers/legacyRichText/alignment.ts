/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type Alignment } from './types';

type LegacyAlign = 'left' | 'center' | 'right' | 'justify';

// Every legacy value maps to the new format's own value; a release that renames them fails typecheck here.
const ALIGNMENT_BY_LEGACY: Record<LegacyAlign, Alignment> = {
    left: 'left',
    center: 'center',
    right: 'right',
    justify: 'justify',
};

const isLegacyAlign = (value: string): value is LegacyAlign => {
    return Object.keys(ALIGNMENT_BY_LEGACY).includes(value);
};

/** Returns the legacy alignment of a new-format one, or the value unchanged when the table has no entry for it. */
export const writeAlignment = (alignment: unknown): unknown => {
    for (const legacy of Object.keys(ALIGNMENT_BY_LEGACY)) {
        if (isLegacyAlign(legacy) && ALIGNMENT_BY_LEGACY[legacy] === alignment) {
            return legacy;
        }
    }

    return alignment;
};

/** Returns the new format's alignment, or undefined when the value is not one of the four legacy ones. */
export const readAlignment = (value: unknown): Alignment | undefined => {
    if (typeof value !== 'string' || !isLegacyAlign(value)) {
        return undefined;
    }

    return ALIGNMENT_BY_LEGACY[value];
};
