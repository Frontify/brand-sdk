import {useEffect, useState} from "react";
import {AppBridgePlatformApp} from "@frontify/app-bridge";

export const usePlatformAppBridge = () => {
    const [platformAppBridge, setPlatformAppBridge] = useState<AppBridgePlatformApp | undefined>();

    useEffect(() => {
        (async () => {
            const appBridge = new AppBridgePlatformApp();
            appBridge.subscribe('Context.connected', () => {
                setPlatformAppBridge(appBridge)
            });
            appBridge.dispatch({name: 'openConnection'});
        })();
    }, []);

    return platformAppBridge;
};
