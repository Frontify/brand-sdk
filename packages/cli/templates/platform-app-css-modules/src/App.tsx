import { AppBridgePlatformApp } from '@frontify/app-bridge';

import style from './style.module.css';

export const App = () => {
    const appBridge = new AppBridgePlatformApp();

    return (
        <div className={style.container}>
            A Frontify Platform App in React with CSS Modules
            <span className={style.text}>Entrypoint: {appBridge.context().get().surface}</span>.
        </div>
    );
};
