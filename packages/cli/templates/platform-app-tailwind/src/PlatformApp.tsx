/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { FC } from 'react';
import { useBlockSettings } from '@frontify/app-bridge';

export const AnExamplePlatformApp: FC = () => {
    const [blockSettings] = useBlockSettings<Settings>(appBridge);

    return (
        <PlatformApp>
            <App />
        </PlatformApp>
    );
};
