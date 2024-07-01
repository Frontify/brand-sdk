import { appContext } from '@frontify/app-bridge-app';

export const App = () => {
    const context = appContext();

    return (
        <div className="container">
            A Frontify Platform App in React with pure CSS
            <span className="container__text">Entrypoint: {context.surface}</span>.
        </div>
    );
};
