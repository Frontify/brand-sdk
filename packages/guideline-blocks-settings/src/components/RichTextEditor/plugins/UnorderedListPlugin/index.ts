/* (c) Copyright Frontify Ltd., all rights reserved. */

import { UnorderedListPlugin as FondueUnorderedListPlugin, type UnorderedListPluginProps } from '@frontify/fondue/rte';

const DEFAULT_LIST_STYLES = [
    {
        color: 'var(--f-theme-settings-list-bullet1-color, currentColor)',
        shape: "var(--f-theme-settings-list-bullet1-shape, '\u2022')",
        size: 'var(--f-theme-settings-list-bullet1-size, 1em)',
    },
    {
        color: 'var(--f-theme-settings-list-bullet2-color, currentColor)',
        shape: "var(--f-theme-settings-list-bullet2-shape, '\u2022')",
        size: 'var(--f-theme-settings-list-bullet2-size, 1em)',
    },
    {
        color: 'var(--f-theme-settings-list-bullet3-color, currentColor)',
        shape: "var(--f-theme-settings-list-bullet3-shape, '\u2022')",
        size: 'var(--f-theme-settings-list-bullet3-size, 1em)',
    },
];

export class UnorderedListPlugin extends FondueUnorderedListPlugin {
    constructor(props?: UnorderedListPluginProps) {
        super({
            listStyles: DEFAULT_LIST_STYLES,
            ...props,
        });
    }
}
