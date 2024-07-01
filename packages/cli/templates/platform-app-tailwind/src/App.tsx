import { appContext } from '@frontify/app-bridge-app';

export const App = () => {
    const context = appContext();

    return (
        <div className="flex h-[100vh] justify-center items-center flex-col">
            A Frontify Platform App in React with tailwind.
            <p className={'text-blue-500'}>Entrypoint: {context.surface}</p>.
        </div>
    );
};
