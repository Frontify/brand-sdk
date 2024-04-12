/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type Color } from '@frontify/fondue';
import { type CSSProperties } from 'react';

import { toRgbaString } from '../color';

export const getBackgroundColorStyles = (backgroundColor: Color): CSSProperties => ({
    backgroundColor: toRgbaString(backgroundColor),
});
