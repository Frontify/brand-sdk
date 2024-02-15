import { App } from './App';
import { defineApp } from '@frontify/platform-app';
import { settings } from './settings';
import '@frontify/fondue/style';

export default defineApp({
    app: App,
    settings,
});
