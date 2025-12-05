/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type PlatePlugin, Plugin, createColumnBreakPlugin, ColumnBreakButton } from '@frontify/fondue/rte';
import { type CSSProperties } from 'react';

import { getResponsiveColumnClasses } from './helpers';

export const KEY_ELEMENT_BREAK_AFTER_COLUMN = 'breakAfterColumn';
export const GAP_DEFAULT = 'normal';

export class BreakAfterPlugin extends Plugin {
    private columns: number;
    private gap: CSSProperties['gap'];
    private customClass: string | undefined;
    constructor(props?: { columns?: number; gap?: string | number }) {
        super('break-after-plugin', {
            button: ColumnBreakButton,
            ...props,
        });
        this.columns = props?.columns ?? 1;
        this.gap = props?.gap ?? GAP_DEFAULT;
        this.customClass = getResponsiveColumnClasses(this.columns);
    }

    plugins(): PlatePlugin[] {
        return [createColumnBreakPlugin(this.columns, this.gap, this.customClass)];
    }
}
