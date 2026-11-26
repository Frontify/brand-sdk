/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type RichTextButtonStyle } from '../../../types';

export type InsertModalDispatchType = { type: string; payload?: Partial<InsertModalStateProps> };

export type InsertModalStateProps = {
    url: string;
    text: string;
    buttonStyle: RichTextButtonStyle;
    newTab: boolean;
};
