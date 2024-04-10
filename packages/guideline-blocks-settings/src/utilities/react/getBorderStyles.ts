/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type Color } from '@frontify/fondue';
import { type CSSProperties } from 'react';

import { BORDER_COLOR_DEFAULT_VALUE } from '../../settings/defaultValues';
import { BorderStyle, borderStyleMap } from '../../settings/types';
import { toRgbaString } from '../color';

export const getBorderStyles = (
    style = BorderStyle.Solid,
    borderWidth = '1px',
    color = BORDER_COLOR_DEFAULT_VALUE as Color,
): CSSProperties => {
    return {
        borderStyle: borderStyleMap[style],
        borderWidth,
        borderColor: toRgbaString(color),
    };
};
