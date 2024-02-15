import { defineSettings } from '@frontify/platform-app';

export const settings = defineSettings({
    credentials: [
        {
            type: 'input',
            id: 'single-line',
            label: 'Input field',
            defaultValue: 'Input Field Value',
        },
    ],
});
