/* (c) Copyright Frontify Ltd., all rights reserved. */

import { CamelCasedPropertiesDeep } from 'type-fest';

import { DocumentLibraryMode } from './Document';

export type ProjectApi = {
    id: number;
    created: string;
    creator: number;
    name: string;
    slug: string;
    account: number;
    token: string;
    email_notification: number;
    user_count: number;
    brand_id: number;
    project_type: string;
    auto_tagging_enabled: Nullable<string>;
    date_begin: Nullable<string>;
    date_end: Nullable<string>;
    is_template: number;
    download_sizes: string;
    zoom_level: string;
    success: boolean;
    project: {
        id: number;
        url: string;
        slug: string;
        creator: number;
        creator_name: string;
        creator_initials: string;
        name: string;
        description: Nullable<string>;
        account: number;
    };
};

export type ProjectCreateApi = {
    name: string;
    brand: number;
    styleguide: number;
    project_type: DocumentLibraryMode;
};

export type Project = CamelCasedPropertiesDeep<ProjectApi>;

export type ProjectCreate = CamelCasedPropertiesDeep<ProjectCreateApi>;
