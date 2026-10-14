import { defineApp } from '@frontify/platform-app';

import { App } from './App';
import { settings } from './settings';

export default defineApp({
    app: App,
    settings,
});
