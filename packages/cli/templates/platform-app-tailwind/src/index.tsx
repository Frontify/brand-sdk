import { App } from './App';
import { defineApp } from '@frontify/platform-app';
import 'tailwindcss/tailwind.css';
import '@frontify/fondue/style';
import './main.css';

export default defineApp({
    app: App,
    settings: {
        basics: [
            {
                type: 'input',
                id: 'single-line',
                label: 'Input field',
                defaultValue: 'Input Field Value',
            },
        ],
    },
});
