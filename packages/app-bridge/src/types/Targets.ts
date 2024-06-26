/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type CamelCasedPropertiesDeep } from 'type-fest';

export type SingleTargetApi = {
    checked: boolean;
    disabled: boolean;
    indeterminate: boolean;
    label: string;
    target: {
        account_id: number;
        asset_ids: unknown[];
        created: string;
        creator: number;
        description: string;
        group_ids: unknown[];
        id: number;
        modified: Nullable<unknown>;
        modifier: Nullable<unknown>;
        name: string;
        sort: number;
        total_groups: Nullable<unknown>;
        total_links: Nullable<unknown>;
        total_users: Nullable<unknown>;
        user_ids: unknown[];
    };
    value: number;
};

export type DocumentTargetsApi = {
    appearance: unknown;
    background_file_id: unknown;
    background_url: unknown;
    heading: unknown;
    id: number;
    link_type: unknown;
    link_url: Nullable<string>;
    logo_file_id: unknown;
    logo_url: unknown;
    mode: unknown;
    portal_title: string;
    subheading: unknown;
    success: boolean;
    targets: {
        disabled: SingleTargetApi[];
        has_selected_targets: boolean;
        targets: SingleTargetApi[];
    };
    title: string;
};

export type DocumentPageTargetsApi = {
    default: boolean;
    disabled: SingleTargetApi[];
    has_selected_targets: boolean;
    id: number;
    success: boolean;
    targets: SingleTargetApi[];
};

export type DocumentTargets = CamelCasedPropertiesDeep<DocumentTargetsApi['targets']>;
export type DocumentPageTargets = CamelCasedPropertiesDeep<DocumentPageTargetsApi>;

export type TargetsUpdateApi = {
    data: boolean;
    success: boolean;
    targets: number[];
};

export type TargetsUpdate = CamelCasedPropertiesDeep<TargetsUpdateApi>;
