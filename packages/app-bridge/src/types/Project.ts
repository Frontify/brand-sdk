/* (c) Copyright Frontify Ltd., all rights reserved. */

import { CamelCasedPropertiesDeep } from 'type-fest';

import { DocumentLibraryMode } from './Document';

export type ProjectApi = {
    name: string;
    brand: number;
    styleguide: number;
    dropdown_actions: string;
    project_type: DocumentLibraryMode;
};

export type Project = CamelCasedPropertiesDeep<ProjectApi>;
