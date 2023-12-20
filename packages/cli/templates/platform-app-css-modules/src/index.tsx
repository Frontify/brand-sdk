import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import { App } from './App';
import '@frontify/fondue/style';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
