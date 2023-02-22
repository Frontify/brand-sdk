/* (c) Copyright Frontify Ltd., all rights reserved. */

/* (c) Copyright Frontify Ltd., all rights reserved. */
import { Token, authorize } from '@frontify/frontify-authenticator';

import React, { FC, ReactElement, useEffect, useState } from 'react';
import { AppBridgePlatformApp } from '../AppBridgePlatformApp';
import { PlatformAppProperties } from '../types/PlatformApp';

export const PlatformAppContext = React.createContext<PlatformAppProperties>({ domain: '', clientId: '' });

// We would need a typed settings Object
type settings = {
    hidden: {
        scope: string[];
    };
    main: any;
    style: any;
};

type PlatformAppProps = {
    children: ReactElement;
    settings: settings;
    appBridge?: AppBridgePlatformApp;
};

export const PlatformApp: FC<PlatformAppProps> = ({ children, settings, appBridge = new AppBridgePlatformApp() }) => {
    const [token, setToken] = useState<Token>();

    /**
     * Initial Screen Info through queryParams
     */
    const { domain, clientId } = appBridge.getScreenInformation<PlatformAppProperties>();

    /**
     * Access the settings
     */
    const scopes = settings.hidden.scope;

    /**
     * get the token through with the Authenticator
     * Impl: refresh of the token
     *
     * -> we could also pass down the token and do the auth on
     * clarify side
     *
     * To have it simple we just store it in the localStorage for now
     * Todo: remove storing in localstorage
     */
    useEffect(() => {
        const auth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                setToken(JSON.parse(token));
            } else {
                const ressourceToken: Token = await authorize({ domain, clientId, scopes });
                setToken(ressourceToken);
                localStorage.setItem('token', JSON.stringify(ressourceToken));
            }
        };

        auth();
    }, []);

    return (
        <PlatformAppContext.Provider value={{ ...appBridge.getScreenInformation(), token }}>
            {children}
        </PlatformAppContext.Provider>
    );
};
