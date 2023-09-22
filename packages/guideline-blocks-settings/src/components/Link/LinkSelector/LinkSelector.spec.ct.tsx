/* (c) Copyright Frontify Ltd., all rights reserved. */

import {
    DocumentApiDummy,
    DocumentPageApiDummy,
    DocumentSectionApiDummy,
    getAppBridgeBlockStub,
    withAppBridgeBlockStubs,
} from '@frontify/app-bridge';
import { mount } from 'cypress/react18';
import { LinkSelector } from './LinkSelector';
import type { SinonStub } from 'sinon';

const LinkSelectorSelector = '[data-test-id="internal-link-selector"]';
const LinkSelectorButtonSelector = '[data-test-id="internal-link-selector"] > button';
const LinkSelectorModalSelector = '[data-test-id="modal-body"]';
const DocumentLinkSelector = '[data-test-id="internal-link-selector-document-link"]';
const DocumentTreeItemToggleSelector = '[data-test-id="tree-item-toggle"]';
const PageLinkSelector = '[data-test-id="internal-link-selector-page-link"]';
const SectionLinkSelector = '[data-test-id="internal-link-selector-section-link"]';

const apiDocuments = [
    { ...DocumentApiDummy.with(1), permanentLink: '/1' },
    { ...DocumentApiDummy.with(2), permanentLink: '/2' },
];
const apiPages = [
    { ...DocumentPageApiDummy.with(1), permanentLink: '/3' },
    { ...DocumentPageApiDummy.with(2), permanentLink: '/4' },
    { ...DocumentPageApiDummy.with(3), permanentLink: '/5' },
];
const apiSections = [
    { ...DocumentSectionApiDummy.with(1), permanentLink: '/6' },
    { ...DocumentSectionApiDummy.with(2), permanentLink: '/7' },
    { ...DocumentSectionApiDummy.with(3), permanentLink: '/8' },
    { ...DocumentSectionApiDummy.with(4), permanentLink: '/9' },
];

describe('Link Selector', () => {
    it('renders the link selector button', () => {
        const [LinkSelectorWithStubs] = withAppBridgeBlockStubs(LinkSelector, {});
        mount(<LinkSelectorWithStubs url="" onUrlChange={cy.stub()} />);
        cy.get(LinkSelectorSelector).should('exist');
    });

    it('opens the modal on button click', () => {
        const appBridge = getAppBridgeBlockStub({
            blockId: 1,
        });
        const apiDocuments = [DocumentApiDummy.with(1)];
        (appBridge.getDocumentGroups as SinonStub) = cy.stub().returns([]);
        (appBridge.getAllDocuments as SinonStub) = cy.stub().returns(Promise.resolve(apiDocuments));

        mount(<LinkSelector appBridge={appBridge} url="" onUrlChange={cy.stub()} />);
        cy.get(LinkSelectorButtonSelector).click();
        cy.get(LinkSelectorModalSelector).should('exist');
    });

    it('renders two documents initially', () => {
        const appBridge = getAppBridgeBlockStub({
            blockId: 1,
        });
        (appBridge.getDocumentGroups as SinonStub) = cy.stub().returns([]);
        (appBridge.getAllDocuments as SinonStub) = cy.stub().returns(Promise.resolve(apiDocuments));

        mount(<LinkSelector appBridge={appBridge} url="" onUrlChange={cy.stub()} />);
        cy.get(LinkSelectorButtonSelector).click();
        cy.get(DocumentLinkSelector).should('have.length', 2);
    });

    it('renders three pages on document expand', () => {
        const appBridge = getAppBridgeBlockStub({
            blockId: 1,
        });

        (appBridge.getDocumentGroups as SinonStub) = cy.stub().returns([]);
        (appBridge.getAllDocuments as SinonStub) = cy.stub().returns(Promise.resolve(apiDocuments));
        (appBridge.getDocumentPagesByDocumentId as SinonStub) = cy.stub().returns(Promise.resolve(apiPages));
        (appBridge.getDocumentSectionsByDocumentPageId as SinonStub) = cy.stub().returns(Promise.resolve(apiSections));

        mount(<LinkSelector appBridge={appBridge} url="" onUrlChange={cy.stub()} />);
        cy.get(LinkSelectorButtonSelector).click();
        cy.get(DocumentLinkSelector).eq(0).find(DocumentTreeItemToggleSelector).click();
        cy.get(PageLinkSelector).should('have.length', 3);
    });

    it('renders four sections on page expand', () => {
        const appBridge = getAppBridgeBlockStub({
            blockId: 1,
        });
        (appBridge.getDocumentGroups as SinonStub) = cy.stub().returns([]);
        (appBridge.getAllDocuments as SinonStub) = cy.stub().returns(Promise.resolve(apiDocuments));
        (appBridge.getDocumentPagesByDocumentId as SinonStub) = cy.stub().returns(Promise.resolve(apiPages));
        (appBridge.getDocumentSectionsByDocumentPageId as SinonStub) = cy.stub().returns(Promise.resolve(apiSections));

        mount(<LinkSelector appBridge={appBridge} url="" onUrlChange={cy.stub()} />);
        cy.get(LinkSelectorButtonSelector).click();
        cy.get(DocumentLinkSelector).eq(0).find(DocumentTreeItemToggleSelector).click();
        cy.get(PageLinkSelector).eq(0).find('button').click();
        cy.get(SectionLinkSelector).should('have.length', 4);
    });

    it('renders the selected section immediately if it is preselected', () => {
        const appBridge = getAppBridgeBlockStub({
            blockId: 1,
        });
        (appBridge.getDocumentGroups as SinonStub) = cy.stub().returns([]);
        (appBridge.getAllDocuments as SinonStub) = cy.stub().returns(Promise.resolve(apiDocuments));
        (appBridge.getDocumentPagesByDocumentId as SinonStub) = cy.stub().returns(Promise.resolve(apiPages));
        (appBridge.getDocumentSectionsByDocumentPageId as SinonStub) = cy.stub().returns(Promise.resolve(apiSections));

        mount(<LinkSelector appBridge={appBridge} url="/7" onUrlChange={cy.stub()} />);
        cy.get(LinkSelectorButtonSelector).click();
        cy.get(SectionLinkSelector).should('have.length', 4);
    });

    it('renders the all section and they are shown on focus and stores if you press enter', () => {
        const appBridge = getAppBridgeBlockStub({
            blockId: 1,
        });
        (appBridge.getDocumentGroups as SinonStub) = cy.stub().returns([]);
        (appBridge.getAllDocuments as SinonStub) = cy.stub().returns(Promise.resolve(apiDocuments));
        (appBridge.getDocumentPagesByDocumentId as SinonStub) = cy.stub().returns(Promise.resolve(apiPages));
        (appBridge.getDocumentSectionsByDocumentPageId as SinonStub) = cy.stub().returns(Promise.resolve(apiSections));

        mount(<LinkSelector appBridge={appBridge} url="" onUrlChange={cy.stub().as('urlChange')} />);
        cy.get(LinkSelectorButtonSelector).click();
        cy.get(DocumentLinkSelector).should('have.length', 2);
        cy.realPress('Tab');
        cy.realPress('Tab');
        cy.realPress('Enter');
        cy.get(PageLinkSelector).should('have.length', 3);
        cy.realPress('Tab');
        cy.realPress('Tab');
        cy.realPress('Enter');
        cy.get(SectionLinkSelector).should('have.length', 4);
        cy.realPress('Tab');
        cy.realPress('Space');
        cy.realPress('Enter');
        cy.get('@urlChange').should('be.calledWith', '/6');
    });
});
