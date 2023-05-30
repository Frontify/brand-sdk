/* (c) Copyright Frontify Ltd., all rights reserved. */

export type Template = {
    id: number;
    name: string;
    description: string;
    projectId: number;
    previewUrl: string;
    pages: TemplatePage[];
};

export type TemplatePage = {
    preview_url: string;
    width: number;
    height: number;
};
