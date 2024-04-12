/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type PlatformAppContext, usePlatformAppBridge } from '@frontify/app-bridge';
import { useEffect, useState } from 'react';

export const App = () => {
    const appBridge = usePlatformAppBridge();
    const [context, setContext] = useState<PlatformAppContext>();

    useEffect(() => {
        if (!appBridge) {
            return;
        }

        setContext(appBridge.context().get());
    }, [appBridge]);

    return (
        <div className="flex h-[100vh] justify-center items-center flex-col">
            A Frontify Platform App in React with tailwind.
            <p className={'text-blue-500'}>Entrypoint: {context?.surface}</p>.
        </div>
    );
};
