/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type Nullable } from './Nullable';

export type TemplateLegacy = {
    id: number;
    title: string;
    description: Nullable<string>;
    previewUrl: string;
    projectId: number;
    height: number;
    width: number;
    published: boolean;
};
