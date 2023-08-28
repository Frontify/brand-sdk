/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { CSSProperties } from 'react';
import { Radius, radiusStyleMap } from '../../settings/types';

export const getRadiusStyles = (radiusChoice: Radius, hasRadius = false, radiusValue?: number): CSSProperties => ({
    borderRadius: hasRadius ? radiusValue : radiusStyleMap[radiusChoice],
});
