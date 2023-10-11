/* (c) Copyright Frontify Ltd., all rights reserved. */

import ReactDOM from 'react-dom/client';
import React from 'react';
import App from './App';
import 'tailwindcss/tailwind.css';
import '@frontify/fondue/style';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
