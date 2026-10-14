import { defineApp } from '@frontify/platform-app';

import { App } from './App';
import { settings } from './settings';
import './main.css';

export default defineApp({
    app: App,
    settings,
});
