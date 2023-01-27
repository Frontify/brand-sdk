/* (c) Copyright Frontify Ltd., all rights reserved. */

import { usePlatformContext } from '@frontify/app-bridge';

export const App = () => {
    const context = usePlatformContext();

    return (
        <div>
            <p>Whats our view: {context.view}</p>
            <p>Whats our token: {context.token}</p>
        </div>
    );
};
