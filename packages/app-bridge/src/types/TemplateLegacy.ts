/* (c) Copyright Frontify Ltd., all rights reserved. */

export type TemplateApiLegacy = {
    asset_created: string;
    asset_modified: string;
    categories: unknown[];
    description: string;
    height: number;
    id: number;
    name: string;
    preview: string;
    project: number;
    project_name: string;
    project_type: string;
    published: number;
    screen_id: number;
    width: number;
};

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
