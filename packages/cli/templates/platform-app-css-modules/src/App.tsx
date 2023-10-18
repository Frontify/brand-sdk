import { useEffect, useState } from 'react';
import { PlatformAppContext, usePlatformAppBridge } from '@frontify/app-bridge';
import style from './style.module.css';

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
        <div className={style.container}>
            A Frontify Platform App in React with CSS Modules
            <span className={style.text}>Entrypoint: {context?.type}</span>.
        </div>
    );
};
