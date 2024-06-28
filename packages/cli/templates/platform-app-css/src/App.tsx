import { AppBridgePlatformApp } from '@frontify/app-bridge';

export const App = () => {
    const appBridge = new AppBridgePlatformApp();

    return (
        <div className="container">
            A Frontify Platform App in React with pure CSS
            <span className="container__text">Entrypoint: {appBridge.context().get().surface}</span>.
        </div>
    );
};
