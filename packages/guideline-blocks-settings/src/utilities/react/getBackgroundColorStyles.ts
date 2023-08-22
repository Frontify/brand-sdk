/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { CSSProperties } from 'react';
import type { Color } from '@frontify/fondue';

import { toRgbaString } from '../color';

export const getBackgroundColorStyles = (backgroundColor: Color): CSSProperties => ({
    backgroundColor: toRgbaString(backgroundColor),
});
