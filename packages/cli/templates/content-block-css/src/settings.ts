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
});
