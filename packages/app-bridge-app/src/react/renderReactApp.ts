/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type PlatformAppConfigExport } from '@frontify/platform-app';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';

import { AppBridgePlatformApp } from '../AppBridgePlatformApp.ts';

export const renderReactApp = (module: PlatformAppConfigExport) => {
    const appBridge = new AppBridgePlatformApp();

    appBridge.subscribe('Context.connected', () => {
        const rootElement = document.getElementById('root');

        if (rootElement) {
            const root = createRoot(rootElement);
            root.render(createElement(module.app));
        } else {
            throw new Error("Element with id 'root' not found");
        }
    });

    appBridge.dispatch({ name: 'openConnection' });
};
