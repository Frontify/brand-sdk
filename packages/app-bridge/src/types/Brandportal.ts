/* (c) Copyright Frontify Ltd., all rights reserved. */

export type BrandportalApi = {
    i18n_settings: {
        languages: BrandportalI18nLanguage[];
    };
};

export type BrandportalI18nLanguage = {
    language: string;
    label: string;
    default?: boolean;
    draft?: boolean;
};

export type Brandportal = {
    i18nSettings: {
        languages: BrandportalI18nLanguage[];
    };
};
