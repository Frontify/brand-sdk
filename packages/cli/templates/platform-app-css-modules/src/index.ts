import { defineApp } from '@frontify/platform-app';

import { App } from './App';
import { settings } from './settings';
import '@frontify/fondue/style';

export default defineApp({
    app: App,
    settings,
});
