/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type Simplify } from 'type-fest';

import { type SingleTargetApi, type CamelCasedPropertiesDeep } from './Targets';

type DocumentLibraryMode =
    | 'MEDIALIBRARY'
    | 'ICONLIBRARY'
    | 'LOGOLIBRARY'
    | 'DOCUMENTLIBRARY'
    | 'TEMPLATELIBRARY'
    | 'TEXTLIBRARY'
    | 'BRANDUPDATELIBRARY';

type DocumentMode = Simplify<'DEFAULT' | DocumentLibraryMode>;

type DocumentAsLink = {
    linkType: 'EXTERNAL';
    linkUrl: string;
};

type DocumentAsNoneLink = {
    linkType: 'INTERNAL';
    linkUrl: Nullable<never>;
};

enum LinkSettingsDisplay {
    TextAndIcon = 'ICON_TEXT',
    IconOnly = 'ICON',
    TextOnly = 'TEXT',
}

enum LinkSettingsIconPosition {
    Right = 'RIGHT',
    Left = 'LEFT',
}

export type Document = Simplify<
    {
        id: number;
        creator: number;
        created: string;
        modifier: Nullable<number>;
        modified: Nullable<string>;
        projectId: number;
        documentGroupId?: Nullable<number>;
        validFrom: string;
        validTo: Nullable<string>;
        visibility: Nullable<string>;
        portalId: Nullable<number>;
        title: string;
        slug: Nullable<string>;
        heading: Nullable<string>;
        subheading: Nullable<string>;
        description: Nullable<string>;
        logo: Nullable<string>;
        sort: number;
        lazy: Nullable<boolean>;
        linkSettings: Nullable<{
            newTab: boolean;
            display?: LinkSettingsDisplay;
            iconPosition?: LinkSettingsIconPosition;
            fileId?: string;
            screenId?: number;
            iconUrl?: string;
            iconFileName?: string;
        }>;
        viewCount: Nullable<number>;
        mode: DocumentMode;
        settings: {
            project?: number;
            projectSlug?: string;
            facettes?: unknown[];
        };
        appearance: Nullable<Record<string, unknown>>;
        logoFileId: Nullable<string>;
        logoSettings: Nullable<unknown>;
        backgroundFileId: Nullable<string>;
        backgroundSettings: Nullable<unknown>;
        targets: Nullable<CamelCasedPropertiesDeep<SingleTargetApi['target'][]>>;
        token: Nullable<string>;
        permanentLink: string;

        // Enriched fields
        numberOfDocumentPageCategories: number;
        numberOfUncategorizedDocumentPages: number;
    } & (DocumentAsLink | DocumentAsNoneLink)
>;
