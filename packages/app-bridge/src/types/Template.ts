/* (c) Copyright Frontify Ltd., all rights reserved. */

export type Template = {
    id: number;
    name: string;
    description: string;
    projectId: number;
    previewUrl: string;
    creationFormUri: string;
    pages: TemplatePage[];
};

export type TemplatePage = {
    previewUrl: string;
    width: number;
    height: number;
};
