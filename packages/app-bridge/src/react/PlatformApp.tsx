/* (c) Copyright Frontify Ltd., all rights reserved. */

import React from 'react';
import { AppBridgePlatformApp } from '../AppBridgePlatformApp';

export const PlatformAppContext = React.createContext({});

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

export const PlatformApp: React.FC = ({ children }) => {
    // check if token exists -> refresh or get new token
    // Inject in GraphQL Library as bearer token

    const AppBridge = new AppBridgePlatformApp();

    return <PlatformAppContext.Provider value={AppBridge.setContextData()}>{children}</PlatformAppContext.Provider>;
};
