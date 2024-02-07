import { App } from './App';
import { defineApp } from '@frontify/platform-apps';
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
