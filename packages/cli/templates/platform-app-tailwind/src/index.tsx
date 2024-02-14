import { App } from './App';
import { defineApp } from '@frontify/platform-app';
import { settings } from './settings';
import 'tailwindcss/tailwind.css';
import '@frontify/fondue/style';
import './main.css';

export default defineApp({
    app: App,
    settings,
});
