import { App } from './App';
import { defineApp } from '@frontify/platform-app';
import { settings } from './settings';
import '@frontify/fondue/style';
import 'tailwindcss/tailwind.css';
import './main.css';

export default defineApp({
    app: App,
    settings,
});
