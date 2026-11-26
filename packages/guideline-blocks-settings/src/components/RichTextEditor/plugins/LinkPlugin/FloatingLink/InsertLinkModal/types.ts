/* (c) Copyright Frontify Ltd., all rights reserved. */

export type InsertModalDispatchType = { type: string; payload?: Partial<InsertModalStateProps> };

export type InsertModalStateProps = {
    url: string;
    text: string;
    newTab: boolean;
};
