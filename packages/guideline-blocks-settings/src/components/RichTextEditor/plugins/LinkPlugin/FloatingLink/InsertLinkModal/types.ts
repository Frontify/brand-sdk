/* (c) Copyright Frontify Ltd., all rights reserved. */

import { CheckboxState } from '@frontify/fondue';

export type InsertModalDispatchType = { type: string; payload?: Partial<InsertModalStateProps> };

export type InsertModalStateProps = {
    url: string;
    text: string;
    newTab: CheckboxState;
};
