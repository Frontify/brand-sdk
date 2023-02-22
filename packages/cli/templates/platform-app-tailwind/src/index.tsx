/* (c) Copyright Frontify Ltd., all rights reserved. */

import 'tailwindcss/tailwind.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { PlatformApp } from '@frontify/app-bridge';
import { App } from './App';
import { settings } from './settings';
import '@frontify/fondue/style';

export const AnExamplePlatformApp = () => {
    // Here we also read out the settings.ts to generate the settings element

    return (
        <PlatformApp settings={settings}>
            <App />
        </PlatformApp>
    );
};

ReactDOM.render(
    <React.StrictMode>
        <AnExamplePlatformApp />
    </React.StrictMode>,
    document.getElementById('root') as HTMLElement
);
