/* (c) Copyright Frontify Ltd., all rights reserved. */

import { FOCUS_VISIBLE_STYLE } from '@frontify/fondue';

import { joinClassNames } from '../../../utilities';

export const getToolbarButtonClassNames = (cursor: 'grab' | 'pointer', forceActiveStyle?: boolean) => {
    const classNames = [
        FOCUS_VISIBLE_STYLE,
        'tw-relative tw-inline-flex tw-items-center tw-justify-center',
        'tw-h-6 tw-p-1',
        'tw-rounded-medium',
        'tw-text-x-small tw-font-medium',
        'tw-gap-0.5',
        'focus-visible:tw-z-10',
    ];

    if (forceActiveStyle) {
        classNames.push(
            'tw-bg-container-secondary-active',
            'tw-text-container-secondary-on-secondary-container',
            cursor === 'grab' ? 'tw-cursor-grabbing' : 'tw-cursor-pointer',
        );
    } else {
        classNames.push(
            'hover:tw-bg-container-secondary-hover active:tw-bg-container-secondary-active',
            'tw-text-secondary hover:tw-text-container-secondary-on-secondary-container active:tw-text-container-secondary-on-secondary-container',
            cursor === 'grab' ? '!tw-cursor-grab active:tw-cursor-grabbing' : 'tw-cursor-pointer',
        );
    }

    return joinClassNames(classNames);
};
