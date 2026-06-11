import { defineApp } from '@frontify/platform-app';

import { App } from './App';
import { settings } from './settings';
import '@frontify/fondue/tokens/base';
import '@frontify/fondue/components/styles';
import '@frontify/fondue/styles';

export default defineApp({
    app: App,
    settings,
});
