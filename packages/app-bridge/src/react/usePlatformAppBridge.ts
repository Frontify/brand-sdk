/* (c) Copyright Frontify Ltd., all rights reserved. */

import { AppBridgePlatformApp } from '../AppBridgePlatformApp';
import { useEffect, useState } from 'react';

export const usePlatformAppBridge = () => {
    const [platformAppBridge] = useState<AppBridgePlatformApp>(new AppBridgePlatformApp());
    const [connected, setConnected] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            platformAppBridge.subscribe('Context.connected', () => {
                setConnected(true);
            });
            platformAppBridge.dispatch({ name: 'openConnection' });
        })();
    }, []);

    return { platformAppBridge, connected };
};
