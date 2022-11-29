import type { DropdownSize, IconEnum } from '@frontify/fondue';
import type { BlockSettings } from '@frontify/guideline-blocks-settings';

export const settings: BlockSettings = {
    main: [
        {
            id: 'main-dropdown',
            type: 'dropdown',
            defaultValue: 'content_block',
            size: 'Large' as DropdownSize.Large,
            disabled: true,
            choices: [
                {
                    value: 'content_block',
                    icon: 'BuildingBlock' as IconEnum,
                    label: 'Content Block',
                },
            ],
        },
    ],
};
