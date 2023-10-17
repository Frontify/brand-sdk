import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './main.css';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
