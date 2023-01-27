/* (c) Copyright Frontify Ltd., all rights reserved. */

export const settings = {
    // These settings are required for the marketplace
    // And labels in Clarify
    hidden: {
        scope: ['basic:read', 'basic:write'],
        entry: {
            // Where do we want to show the App
            view: 'asset-creation',
            // Dependent on view
            options: {
                // have some view specific data here, can change dependent on view
                label: 'Ai generated Image',
                icon: 'super.ai.com/image/logo',
            },
        },
    },
    // These are then the settings fields that are shown with a button inside of the Application
    main: [],
    style: [
        {
            id: 'color',
            label: 'Text Color',
            type: 'slider',
            defaultValue: 'violet',
            choices: [
                { label: 'Violet', value: 'violet' },
                { label: 'Blue', value: 'blue' },
                { label: 'Green', value: 'green' },
                { label: 'Red', value: 'red' },
            ],
        },
    ],
};
