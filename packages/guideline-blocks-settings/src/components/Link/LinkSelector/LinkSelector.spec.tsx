/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type Document, type DocumentPage, type DocumentSection, DocumentSectionApiDummy } from '@frontify/app-bridge';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { DocumentApiDummy, DocumentPageApiDummy } from '../../../testing/dummies/DocumentPageApiDummy';

import { LinkSelector } from './LinkSelector';

const LINK_SELECTOR_TEST_ID = 'internal-link-selector';
const DIALOG_BODY_TEST_ID = 'fondue-dialog-body';
const DOCUMENT_LINK_TEST_ID = 'internal-link-selector-document-link';
const TREE_ITEM_TOGGLE_TEST_ID = 'tree-item-toggle';
const PAGE_LINK_TEST_ID = 'internal-link-selector-page-link';
const SECTION_LINK_TEST_ID = 'internal-link-selector-section-link';

const apiDocuments = [
    { ...DocumentApiDummy.with(1), permanentLink: '/1' },
    { ...DocumentApiDummy.with(2), permanentLink: '/2' },
] as unknown as Document[];

const apiPages = [
    { ...DocumentPageApiDummy.with(1), permanentLink: '/3' },
    { ...DocumentPageApiDummy.with(2), permanentLink: '/4' },
    { ...DocumentPageApiDummy.with(3), permanentLink: '/5' },
] as unknown as DocumentPage[];

const apiSections = [
    { ...DocumentSectionApiDummy.with(1), permanentLink: '/6' },
    { ...DocumentSectionApiDummy.with(2), permanentLink: '/7' },
    { ...DocumentSectionApiDummy.with(3), permanentLink: '/8' },
    { ...DocumentSectionApiDummy.with(4), permanentLink: '/9' },
] as unknown as DocumentSection[];

type RenderLinkSelectorOptions = {
    url?: string;
    onUrlChange?: (value: string) => void;
    documents?: Document[];
    pages?: DocumentPage[];
    sections?: DocumentSection[];
};

const renderLinkSelector = ({
    url = '',
    onUrlChange = vi.fn(),
    documents = apiDocuments,
    pages = apiPages,
    sections = apiSections,
}: RenderLinkSelectorOptions = {}) => {
    const getAllDocuments = vi.fn(() => Promise.resolve(documents));
    const getDocumentPagesByDocumentId = vi.fn(() => Promise.resolve(pages));
    const getDocumentSectionsByDocumentPageId = vi.fn(() => Promise.resolve(sections));

    const utils = render(
        <LinkSelector
            getAllDocuments={getAllDocuments}
            getDocumentPagesByDocumentId={getDocumentPagesByDocumentId}
            getDocumentSectionsByDocumentPageId={getDocumentSectionsByDocumentPageId}
            url={url}
            onUrlChange={onUrlChange}
        />,
    );

    return { ...utils, onUrlChange, getAllDocuments };
};

const openModal = async () => {
    await userEvent.click(within(screen.getByTestId(LINK_SELECTOR_TEST_ID)).getByRole('button'));
    expect(await screen.findByTestId(DIALOG_BODY_TEST_ID)).toBeInTheDocument();
};

const expandFirstDocument = async () => {
    const documentLinks = await screen.findAllByTestId(DOCUMENT_LINK_TEST_ID);
    await userEvent.click(within(documentLinks[0]).getByTestId(TREE_ITEM_TOGGLE_TEST_ID));
};

const expandFirstPage = async () => {
    const pageLinks = await screen.findAllByTestId(PAGE_LINK_TEST_ID);
    await userEvent.click(within(pageLinks[0]).getByRole('button'));
};

describe('Link Selector', () => {
    it('should render the link selector button', () => {
        renderLinkSelector();

        expect(screen.getByTestId(LINK_SELECTOR_TEST_ID)).toBeInTheDocument();
    });

    it('should open the modal on button click', async () => {
        renderLinkSelector({ documents: [apiDocuments[0]] });

        await openModal();
    });

    it('should render two documents initially', async () => {
        renderLinkSelector();

        await openModal();

        expect(await screen.findAllByTestId(DOCUMENT_LINK_TEST_ID)).toHaveLength(2);
    });

    it('should render three pages on document expand', async () => {
        renderLinkSelector();

        await openModal();
        await expandFirstDocument();

        expect(await screen.findAllByTestId(PAGE_LINK_TEST_ID)).toHaveLength(3);
    });

    it('should render four sections on page expand', async () => {
        renderLinkSelector();

        await openModal();
        await expandFirstDocument();
        await expandFirstPage();

        expect(await screen.findAllByTestId(SECTION_LINK_TEST_ID)).toHaveLength(4);
    });

    it('should filter out sections that have unreadable titles', async () => {
        renderLinkSelector({
            sections: [apiSections[0], { ...apiSections[2], title: ' ' }, { ...apiSections[3], title: '' }],
        });

        await openModal();
        await expandFirstDocument();
        await expandFirstPage();

        expect(await screen.findAllByTestId(SECTION_LINK_TEST_ID)).toHaveLength(1);
    });

    it('should render the selected section immediately if it is preselected', async () => {
        renderLinkSelector({ url: '/7' });

        await openModal();

        expect(await screen.findAllByTestId(SECTION_LINK_TEST_ID)).toHaveLength(4);
    });

    it('should mark the selected section as active and report it when it is chosen', async () => {
        const { onUrlChange } = renderLinkSelector();

        await openModal();
        await expandFirstDocument();
        await expandFirstPage();

        const sectionLinks = await screen.findAllByTestId(SECTION_LINK_TEST_ID);
        await userEvent.click(sectionLinks[0]);

        expect(sectionLinks[0]).toHaveAttribute('data-is-active', 'true');

        await userEvent.click(screen.getByRole('button', { name: 'Choose' }));

        expect(onUrlChange).toHaveBeenCalledWith('/6');
    });
});
