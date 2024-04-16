/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type SnakeCasedPropertiesDeep } from 'type-fest';

import { type Template } from './Template';

export type DocumentBlockTemplateApi = Omit<SnakeCasedPropertiesDeep<DocumentBlockTemplate>, 'template'> & {
    template: Template;
};

export type DocumentBlockTemplate = {
    id: number;
    creator: number;
    created: string;
    modifier: number;
    modified: string;
    validTo: Nullable<string>;
    documentBlockId: number;
    settingId: string;
    templateId: number;

    // Enriched
    template: Template;
};
