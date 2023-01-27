/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useContext } from 'react';
import { PlatformAppContext } from './PlatformApp';
import { PlatformAppProperties } from '../types/PlatformApp';

// The context will be dependent on the view
// We need to define better the context
export const usePlatformContext = (): PlatformAppProperties => {
    return useContext<PlatformAppProperties>(PlatformAppContext);
};
