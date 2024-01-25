/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';
import { CoverPageDummy } from '../tests/CoverPageDummy';
import { computeCoverPageLink, computeDocumentLink, computeDocumentPageLink } from './link';
import { DocumentCategoryDummy, DocumentDummy, DocumentPageDummy } from '../tests';

const PORTAL_ID = 23451;
const PORTAL_TOKEN = 'weisdfjsdf';
const DOCUMENT_ID = 2937;
const DOCUMENT_CATEGORY_ID = 2314;
const DOCUMENT_PAGE_ID = 9382;

describe('computeCoverPageLink', () => {
    it('should return the correct link when private', () => {
        const coverPage = CoverPageDummy.with(PORTAL_ID);
        const language = { currentLanguage: 'en', defaultLanguage: 'en' };

        const result = computeCoverPageLink({ coverPage, language, portalToken: null });

        expect(result).toEqual(`/hub/${PORTAL_ID}`);
    });

    it('should return the correct link when private with same language as default', () => {
        const coverPage = CoverPageDummy.with(PORTAL_ID);
        const language = { currentLanguage: 'en', defaultLanguage: 'en' };

        const result = computeCoverPageLink({ coverPage, language, portalToken: null });

        expect(result).toEqual(`/hub/${PORTAL_ID}`);
    });

    it('should return the correct link when private with different language from default', () => {
        const coverPage = { ...CoverPageDummy.with(PORTAL_ID), url: `/hub/${PORTAL_ID}/fr` };
        const language = { currentLanguage: 'fr', defaultLanguage: 'en' };

        const result = computeCoverPageLink({ coverPage, language, portalToken: null });

        expect(result).toEqual(`/hub/${PORTAL_ID}/fr`);
    });

    it('should return the correct link when publicly shared', () => {
        const coverPage = CoverPageDummy.with(PORTAL_ID);
        const language = { currentLanguage: 'en', defaultLanguage: 'en' };

        const result = computeCoverPageLink({ coverPage, language, portalToken: PORTAL_TOKEN });

        expect(result).toEqual(`/d/${PORTAL_TOKEN}`);
    });

    it('should return the correct link when publicly shared with same language as default', () => {
        const coverPage = CoverPageDummy.with(PORTAL_ID);
        const language = { currentLanguage: 'en', defaultLanguage: 'en' };

        const result = computeCoverPageLink({ coverPage, language, portalToken: PORTAL_TOKEN });

        expect(result).toEqual(`/d/${PORTAL_TOKEN}`);
    });

    it('should return the correct link when publicly shared with different language from default', () => {
        const coverPage = CoverPageDummy.with(PORTAL_ID);
        const language = { currentLanguage: 'fr', defaultLanguage: 'en' };

        const result = computeCoverPageLink({ coverPage, language, portalToken: PORTAL_TOKEN });

        expect(result).toEqual(`/d/${PORTAL_TOKEN}/fr`);
    });
});

describe('computeDocumentLink', () => {
    it('should return the correct link when private', () => {
        const document = DocumentDummy.with(DOCUMENT_ID);
        const language = { currentLanguage: 'en', defaultLanguage: 'en' };

        const result = computeDocumentLink({ document, language, portalToken: null });
        expect(result).toEqual(`/document/${DOCUMENT_ID}`);
    });

    it('should return the correct link when private with same language as default', () => {
        const document = DocumentDummy.with(DOCUMENT_ID);
        const language = { currentLanguage: 'en', defaultLanguage: 'en' };

        const result = computeDocumentLink({ document, language, portalToken: null });
        expect(result).toEqual(`/document/${DOCUMENT_ID}`);
    });

    it('should return the correct link when private with different language from default', () => {
        const document = DocumentDummy.with(DOCUMENT_ID);
        const language = { currentLanguage: 'fr', defaultLanguage: 'en' };

        const result = computeDocumentLink({ document, language, portalToken: null });
        expect(result).toEqual(`/document/${DOCUMENT_ID}/fr`);
    });

    it('should return the correct link when publicly shared', () => {
        const document = DocumentDummy.with(DOCUMENT_ID);
        const language = { currentLanguage: 'en', defaultLanguage: 'en' };

        const result = computeDocumentLink({ document, language, portalToken: PORTAL_TOKEN });
        expect(result).toEqual(`/d/${PORTAL_TOKEN}/${document.slug}`);
    });

    it('should return the correct link when publicly shared with same language as default', () => {
        const document = DocumentDummy.with(DOCUMENT_ID);
        const language = { currentLanguage: 'en', defaultLanguage: 'en' };

        const result = computeDocumentLink({ document, language, portalToken: PORTAL_TOKEN });
        expect(result).toEqual(`/d/${PORTAL_TOKEN}/${document.slug}`);
    });

    it('should return the correct link when publicly shared with different language from default', () => {
        const document = DocumentDummy.with(DOCUMENT_ID);
        const language = { currentLanguage: 'fr', defaultLanguage: 'en' };

        const result = computeDocumentLink({ document, language, portalToken: PORTAL_TOKEN });
        expect(result).toEqual(`/d/${PORTAL_TOKEN}/fr/${document.slug}`);
    });
});

describe('computeDocumentPageLink', () => {
    it('should return the correct link when private (without category)', () => {
        const document = DocumentDummy.with(DOCUMENT_ID);
        const documentPage = DocumentPageDummy.with(DOCUMENT_PAGE_ID);
        const language = { currentLanguage: 'en', defaultLanguage: 'en' };

        const result = computeDocumentPageLink({ document, documentPage, language, portalToken: null });
        expect(result).toEqual(`/document/${DOCUMENT_ID}#/-/${documentPage.slug}`);
    });

    it('should return the correct link when private (with category)', () => {
        const document = DocumentDummy.with(DOCUMENT_ID);
        const documentCategory = DocumentCategoryDummy.with(DOCUMENT_CATEGORY_ID);
        const documentPage = DocumentPageDummy.with(DOCUMENT_PAGE_ID);
        const language = { currentLanguage: 'en', defaultLanguage: 'en' };

        const result = computeDocumentPageLink({
            document,
            documentCategory,
            documentPage,
            language,
            portalToken: null,
        });
        expect(result).toEqual(`/document/${DOCUMENT_ID}#/${documentCategory.slug}/${documentPage.slug}`);
    });

    it('should return the correct link when private with same language as default (without category)', () => {
        const document = DocumentDummy.with(DOCUMENT_ID);
        const documentPage = DocumentPageDummy.with(DOCUMENT_PAGE_ID);
        const language = { currentLanguage: 'en', defaultLanguage: 'en' };

        const result = computeDocumentPageLink({ document, documentPage, language, portalToken: null });
        expect(result).toEqual(`/document/${DOCUMENT_ID}#/-/${documentPage.slug}`);
    });

    it('should return the correct link when private with same language as default (with category)', () => {
        const document = DocumentDummy.with(DOCUMENT_ID);
        const documentCategory = DocumentCategoryDummy.with(DOCUMENT_CATEGORY_ID);
        const documentPage = DocumentPageDummy.with(DOCUMENT_PAGE_ID);
        const language = { currentLanguage: 'en', defaultLanguage: 'en' };

        const result = computeDocumentPageLink({
            document,
            documentCategory,
            documentPage,
            language,
            portalToken: null,
        });
        expect(result).toEqual(`/document/${DOCUMENT_ID}#/${documentCategory.slug}/${documentPage.slug}`);
    });

    it('should return the correct link when private with different language from default (without category)', () => {
        const document = DocumentDummy.with(DOCUMENT_ID);
        const documentPage = DocumentPageDummy.with(DOCUMENT_PAGE_ID);
        const language = { currentLanguage: 'fr', defaultLanguage: 'en' };

        const result = computeDocumentPageLink({ document, documentPage, language, portalToken: null });
        expect(result).toEqual(`/document/${DOCUMENT_ID}/fr#/-/${documentPage.slug}`);
    });

    it('should return the correct link when private with different language from default (with category)', () => {
        const document = DocumentDummy.with(DOCUMENT_ID);
        const documentCategory = DocumentCategoryDummy.with(DOCUMENT_CATEGORY_ID);
        const documentPage = DocumentPageDummy.with(DOCUMENT_PAGE_ID);
        const language = { currentLanguage: 'fr', defaultLanguage: 'en' };

        const result = computeDocumentPageLink({
            document,
            documentCategory,
            documentPage,
            language,
            portalToken: null,
        });
        expect(result).toEqual(`/document/${DOCUMENT_ID}/fr#/${documentCategory.slug}/${documentPage.slug}`);
    });

    it('should return the correct link when publicly shared (without category)', () => {
        const document = DocumentDummy.with(DOCUMENT_ID);
        const documentPage = DocumentPageDummy.with(DOCUMENT_PAGE_ID);
        const language = { currentLanguage: 'en', defaultLanguage: 'en' };

        const result = computeDocumentPageLink({ document, documentPage, language, portalToken: PORTAL_TOKEN });
        expect(result).toEqual(`/d/${PORTAL_TOKEN}/${document.slug}#/-/${documentPage.slug}`);
    });

    it('should return the correct link when publicly shared (with category)', () => {
        const document = DocumentDummy.with(DOCUMENT_ID);
        const documentCategory = DocumentCategoryDummy.with(DOCUMENT_CATEGORY_ID);
        const documentPage = DocumentPageDummy.with(DOCUMENT_PAGE_ID);
        const language = { currentLanguage: 'en', defaultLanguage: 'en' };

        const result = computeDocumentPageLink({
            document,
            documentCategory,
            documentPage,
            language,
            portalToken: PORTAL_TOKEN,
        });
        expect(result).toEqual(`/d/${PORTAL_TOKEN}/${document.slug}#/${documentCategory.slug}/${documentPage.slug}`);
    });

    it('should return the correct link when publicly shared with same language as default (without category)', () => {
        const document = DocumentDummy.with(DOCUMENT_ID);
        const documentPage = DocumentPageDummy.with(DOCUMENT_PAGE_ID);
        const language = { currentLanguage: 'en', defaultLanguage: 'en' };

        const result = computeDocumentPageLink({ document, documentPage, language, portalToken: PORTAL_TOKEN });
        expect(result).toEqual(`/d/${PORTAL_TOKEN}/${document.slug}#/-/${documentPage.slug}`);
    });

    it('should return the correct link when publicly shared with same language as default (with category)', () => {
        const document = DocumentDummy.with(DOCUMENT_ID);
        const documentCategory = DocumentCategoryDummy.with(DOCUMENT_CATEGORY_ID);
        const documentPage = DocumentPageDummy.with(DOCUMENT_PAGE_ID);
        const language = { currentLanguage: 'en', defaultLanguage: 'en' };

        const result = computeDocumentPageLink({
            document,
            documentCategory,
            documentPage,
            language,
            portalToken: PORTAL_TOKEN,
        });
        expect(result).toEqual(`/d/${PORTAL_TOKEN}/${document.slug}#/${documentCategory.slug}/${documentPage.slug}`);
    });

    it('should return the correct link when publicly shared with different language from default (without category)', () => {
        const document = DocumentDummy.with(DOCUMENT_ID);
        const documentPage = DocumentPageDummy.with(DOCUMENT_PAGE_ID);
        const language = { currentLanguage: 'fr', defaultLanguage: 'en' };

        const result = computeDocumentPageLink({ document, documentPage, language, portalToken: PORTAL_TOKEN });
        expect(result).toEqual(`/d/${PORTAL_TOKEN}/fr/${document.slug}#/-/${documentPage.slug}`);
    });

    it('should return the correct link when publicly shared with different language from default (with category)', () => {
        const document = DocumentDummy.with(DOCUMENT_ID);
        const documentCategory = DocumentCategoryDummy.with(DOCUMENT_CATEGORY_ID);
        const documentPage = DocumentPageDummy.with(DOCUMENT_PAGE_ID);
        const language = { currentLanguage: 'fr', defaultLanguage: 'en' };

        const result = computeDocumentPageLink({
            document,
            documentCategory,
            documentPage,
            language,
            portalToken: PORTAL_TOKEN,
        });
        expect(result).toEqual(`/d/${PORTAL_TOKEN}/fr/${document.slug}#/${documentCategory.slug}/${documentPage.slug}`);
    });
});
