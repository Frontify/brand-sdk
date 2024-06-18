import { AppBridgePlatformApp } from '@frontify/app-bridge';

export const App = () => {
    const appBridge = new AppBridgePlatformApp();

    return (
        <div className="flex h-[100vh] justify-center items-center flex-col">
            A Frontify Platform App in React with tailwind.
            <p className={'text-blue-500'}>Entrypoint: {appBridge.context().get().surface}</p>.
        </div>
    );
};
