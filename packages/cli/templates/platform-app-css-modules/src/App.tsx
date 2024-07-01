import { appContext } from '@frontify/app-bridge-app';

import style from './style.module.css';

export const App = () => {
    const context = appContext();

    return (
        <div className={style.container}>
            A Frontify Platform App in React with CSS Modules
            <span className={style.text}>Entrypoint: {context.surface}</span>.
        </div>
    );
};
