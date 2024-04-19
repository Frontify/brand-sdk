/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type CamelCasedPropertiesDeep } from 'type-fest';

export type Template = {
    id: number;
    name: string;
    description: string;
    projectId: number;
    previewUrl: string;
    creationFormUri: string;
    pages: TemplatePage[];
};

export type TemplatePageApi = {
    preview_url: string;
    width: number;
    height: number;
};

export type TemplatePage = CamelCasedPropertiesDeep<TemplatePageApi>;
