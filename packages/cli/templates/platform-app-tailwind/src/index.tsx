import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import 'tailwindcss/tailwind.css';
import "@frontify/fondue/style";


ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
)
