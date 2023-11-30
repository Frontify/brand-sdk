/* (c) Copyright Frontify Ltd., all rights reserved. */

import type { CoverPage, Document, DocumentCategory, DocumentPage } from '../types';

export const computeCoverPageLink = ({
    coverPage,
    language,
    portalToken,
}: {
    coverPage: CoverPage;
    language: {
        currentLanguage: string;
        defaultLanguage: string;
    };
    portalToken: Nullable<string>;
}) => {
    const languageUrlPart = language.currentLanguage === language.defaultLanguage ? '' : `/${language.currentLanguage}`;

    if (portalToken) {
        return `/d/${portalToken}${languageUrlPart}`;
    }

    return coverPage.url;
};

export const computeDocumentLink = ({
    document,
    language,
    portalToken,
}: {
    document: Document;
    language: {
        currentLanguage: string;
        defaultLanguage: string;
    };
    portalToken: Nullable<string>;
}) => {
    const languageUrlPart = language.currentLanguage === language.defaultLanguage ? '' : `/${language.currentLanguage}`;

    if (portalToken) {
        return `/d/${portalToken}${languageUrlPart}/${document.slug}`;
    }

    return `/document/${document.id}${languageUrlPart}`;
};

export const computeDocumentPageLink = ({
    documentPage,
    language,
    portalToken,
    document,
    documentCategory,
}: {
    documentPage: DocumentPage;
    document: Document;
    documentCategory?: DocumentCategory;
    language: {
        currentLanguage: string;
        defaultLanguage: string;
    };
    portalToken: Nullable<string>;
}) => {
    const categoryUrlPart = documentCategory ? `${documentCategory.slug}/` : '-/';
    const languageUrlPart = language.currentLanguage === language.defaultLanguage ? '' : `/${language.currentLanguage}`;
    if (portalToken) {
        return `/d/${portalToken}${languageUrlPart}/${document.slug}#/${categoryUrlPart}${documentPage.slug}`;
    }

    return `/document/${document.id}${languageUrlPart}#/${categoryUrlPart}${documentPage.slug}`;
};
