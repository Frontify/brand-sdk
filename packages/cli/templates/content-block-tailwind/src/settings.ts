import { defineSettings, DropdownSize, IconEnum } from '@frontify/guideline-blocks-settings';

export const settings = defineSettings({
    main: [
        {
            id: 'main-dropdown',
            type: 'dropdown',
            defaultValue: 'content_block',
            size: DropdownSize.Large,
            disabled: true,
            choices: [
                {
                    value: 'content_block',
                    icon: IconEnum.BuildingBlock,
                    label: 'Content Block',
                },
            ],
        },
    ],
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
});
