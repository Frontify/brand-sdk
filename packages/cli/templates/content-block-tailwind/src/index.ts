import 'tailwindcss/tailwind.css';

import { defineBlock } from '@frontify/guideline-blocks-settings';

import { AnExampleBlock } from './Block';
import { settings } from './settings';

export default defineBlock({
    block: AnExampleBlock,
    settings,
});
