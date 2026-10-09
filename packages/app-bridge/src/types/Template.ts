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

type TemplatePage = {
    previewUrl: string;
    width: number;
    height: number;
};
