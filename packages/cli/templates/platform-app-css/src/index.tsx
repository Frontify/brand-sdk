import { App } from './App';
import { defineApp } from '@frontify/platform-app';
import './main.css';
import '@frontify/fondue/style';

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
