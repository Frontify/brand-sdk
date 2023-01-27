/* (c) Copyright Frontify Ltd., all rights reserved. */

import React, { FC, ReactElement } from 'react';
import { AppBridgePlatformApp } from '../AppBridgePlatformApp';
import { PlatformAppProperties } from '../types/PlatformApp';

export const PlatformAppContext = React.createContext<PlatformAppProperties>({});

// Just to demo, AppBridge is no object like that
// export const AppBridge = {
//     setContextData: () => getQueryParams(),
//     getContext: () => React.useContext(PlatformAppContext),
//     // Uses GraphQl Library with bearer token injectd
//     // We will call against the Public API
//     get: (graphQlQuery) => console.log('execute query', graphQlQuery),
//     // Uses GraphQl Library with bearer token injectd
//     set: (graphQlQuery, data) =>
//         console.log('execute Query with data', graphQlQuery, data),
// };

type settings = {
    hidden: any;
    main: any;
    style: any;
};

type PlatformAppProps = {
    children: ReactElement;
    settings: settings;
};

export const PlatformApp: FC<PlatformAppProps> = ({ children, settings }) => {
    // check if token exists -> refresh or get new token
    // Inject in GraphQL Library as bearer token

    const AppBridge = new AppBridgePlatformApp();

    const scopeSettings = settings.hidden.scope;
    const entryView = settings.hidden.entry.view;
    const styling = settings.style[0].id;

    return (
        <PlatformAppContext.Provider value={AppBridge.setContextData()}>
            <p>Settings: {scopeSettings}</p>
            <p>Scope: {entryView}</p>
            <p>Styling: {styling} </p>

            {children}
        </PlatformAppContext.Provider>
    );
};
