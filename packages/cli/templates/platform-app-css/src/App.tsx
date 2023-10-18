import { useEffect, useState } from 'react';
import { PlatformAppContext, usePlatformAppBridge } from '@frontify/app-bridge';

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
        <div className="container">
            A Frontify Platform App in React with pure CSS
            <span className="container__text">Entrypoint: {context?.type}</span>.
        </div>
    );
};
