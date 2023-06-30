/* (c) Copyright Frontify Ltd., all rights reserved. */

import { CSSProperties } from 'react';

import { Color } from '@frontify/fondue';

import { toRgbaString } from '../color';

export const getBackgroundColorStyles = (backgroundColor: Color): CSSProperties => ({
    backgroundColor: toRgbaString(backgroundColor),
});
