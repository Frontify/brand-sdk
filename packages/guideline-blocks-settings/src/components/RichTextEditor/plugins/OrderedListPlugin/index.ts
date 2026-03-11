/* (c) Copyright Frontify Ltd., all rights reserved. */

import { OrderedListPlugin as FondueOrderedListPlugin, type OrderedListPluginProps } from '@frontify/fondue/rte';

const DEFAULT_LIST_STYLES = [
    {
        counterType: 'var(--f-theme-settings-list-numbered1-counterType, decimal)',
        color: 'var(--f-theme-settings-list-numbered1-color, currentColor)',
    },
    {
        counterType: 'var(--f-theme-settings-list-numbered2-counterType, lower-alpha)',
        color: 'var(--f-theme-settings-list-numbered2-color, currentColor)',
    },
    {
        counterType: 'var(--f-theme-settings-list-numbered3-counterType, lower-roman)',
        color: 'var(--f-theme-settings-list-numbered3-color, currentColor)',
    },
];

export class OrderedListPlugin extends FondueOrderedListPlugin {
    constructor(props?: OrderedListPluginProps) {
        super({
            listStyles: DEFAULT_LIST_STYLES,
            ...props,
        });
    }
}
