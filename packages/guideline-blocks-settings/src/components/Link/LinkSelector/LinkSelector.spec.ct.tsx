/* (c) Copyright Frontify Ltd., all rights reserved. */

import { mount } from 'cypress/react18';
import { LinkSelector } from './LinkSelector';
import { getAppBridgeTestingPackage } from '../../../tests/helpers/getAppBridgeTestingPackage';

const LinkSelectorSelector = '[data-test-id="internal-link-selector"]';
const LinkSelectorButtonSelector = '[data-test-id="internal-link-selector"] > button';
const LinkSelectorModalSelector = '[data-test-id="modal-body"]';
const DocumentLinkSelector = '[data-test-id="internal-link-selector-document-link"]';
const DocumentTreeItemToggleSelector = '[data-test-id="tree-item-toggle"]';
const PageLinkSelector = '[data-test-id="internal-link-selector-page-link"]';
const SectionLinkSelector = '[data-test-id="internal-link-selector-section-link"]';

describe('Link Selector', () => {
    let apiDocuments: any = [];
    let apiPages: any = [];
    let apiSections: any = [];

    before(async () => {
        const { DocumentApiDummy, DocumentPageApiDummy, DocumentSectionApiDummy } = await getAppBridgeTestingPackage();

        apiDocuments = [
            { ...DocumentApiDummy.with(1), permanentLink: '/1' },
            { ...DocumentApiDummy.with(2), permanentLink: '/2' },
        ];
        apiPages = [
            { ...DocumentPageApiDummy.with(1), permanentLink: '/3' },
            { ...DocumentPageApiDummy.with(2), permanentLink: '/4' },
            { ...DocumentPageApiDummy.with(3), permanentLink: '/5' },
        ];
        apiSections = [
            { ...DocumentSectionApiDummy.with(1), permanentLink: '/6' },
            { ...DocumentSectionApiDummy.with(2), permanentLink: '/7' },
            { ...DocumentSectionApiDummy.with(3), permanentLink: '/8' },
            { ...DocumentSectionApiDummy.with(4), permanentLink: '/9' },
        ];
    });

    it('renders the link selector button', async () => {
        const { withAppBridgeBlockStubs } = await getAppBridgeTestingPackage();

        const [LinkSelectorWithStubs] = withAppBridgeBlockStubs(LinkSelector, {});
        mount(<LinkSelectorWithStubs url="" onUrlChange={cy.stub()} />);
        cy.get(LinkSelectorSelector).should('exist');
    });

    it('opens the modal on button click', async () => {
        const { DocumentApiDummy, getAppBridgeBlockStub } = await getAppBridgeTestingPackage();

        const appBridge = getAppBridgeBlockStub({
            blockId: 1,
        });
        const apiDocuments = [DocumentApiDummy.with(1)];
        // @ts-expect-error Stubbing
        appBridge.getDocumentGroups = cy.stub().returns([]);
        // @ts-expect-error Stubbing
        appBridge.getAllDocuments = cy.stub().returns(Promise.resolve(apiDocuments));

        mount(<LinkSelector appBridge={appBridge} url="" onUrlChange={cy.stub()} />);
        cy.get(LinkSelectorButtonSelector).click();
        cy.get(LinkSelectorModalSelector).should('exist');
    });

    it('renders two documents initially', async () => {
        const { getAppBridgeBlockStub } = await getAppBridgeTestingPackage();

        const appBridge = getAppBridgeBlockStub({
            blockId: 1,
        });
        // @ts-expect-error Stubbing
        appBridge.getDocumentGroups = cy.stub().returns([]);
        // @ts-expect-error Stubbing
        appBridge.getAllDocuments = cy.stub().returns(Promise.resolve(apiDocuments));

        mount(<LinkSelector appBridge={appBridge} url="" onUrlChange={cy.stub()} />);
        cy.get(LinkSelectorButtonSelector).click();
        cy.get(DocumentLinkSelector).should('have.length', 2);
    });

    it('renders three pages on document expand', async () => {
        const { getAppBridgeBlockStub } = await getAppBridgeTestingPackage();

        const appBridge = getAppBridgeBlockStub({
            blockId: 1,
        });

        // @ts-expect-error Stubbing
        appBridge.getDocumentGroups = cy.stub().returns([]);
        // @ts-expect-error Stubbing
        appBridge.getAllDocuments = cy.stub().returns(Promise.resolve(apiDocuments));
        // @ts-expect-error Stubbing
        appBridge.getDocumentPagesByDocumentId = cy.stub().returns(Promise.resolve(apiPages));
        // @ts-expect-error Stubbing
        appBridge.getDocumentSectionsByDocumentPageId = cy.stub().returns(Promise.resolve(apiSections));

        mount(<LinkSelector appBridge={appBridge} url="" onUrlChange={cy.stub()} />);
        cy.get(LinkSelectorButtonSelector).click();
        cy.get(DocumentLinkSelector).eq(0).find(DocumentTreeItemToggleSelector).click();
        cy.get(PageLinkSelector).should('have.length', 3);
    });

    it('renders four sections on page expand', async () => {
        const { getAppBridgeBlockStub } = await getAppBridgeTestingPackage();

        const appBridge = getAppBridgeBlockStub({
            blockId: 1,
        });
        // @ts-expect-error Stubbing
        appBridge.getDocumentGroups = cy.stub().returns([]);
        // @ts-expect-error Stubbing
        appBridge.getAllDocuments = cy.stub().returns(Promise.resolve(apiDocuments));
        // @ts-expect-error Stubbing
        appBridge.getDocumentPagesByDocumentId = cy.stub().returns(Promise.resolve(apiPages));
        // @ts-expect-error Stubbing
        appBridge.getDocumentSectionsByDocumentPageId = cy.stub().returns(Promise.resolve(apiSections));

        mount(<LinkSelector appBridge={appBridge} url="" onUrlChange={cy.stub()} />);
        cy.get(LinkSelectorButtonSelector).click();
        cy.get(DocumentLinkSelector).eq(0).find(DocumentTreeItemToggleSelector).click();
        cy.get(PageLinkSelector).eq(0).find('button').click();
        cy.get(SectionLinkSelector).should('have.length', 4);
    });

    it('renders the selected section immediately if it is preselected', async () => {
        const { getAppBridgeBlockStub } = await getAppBridgeTestingPackage();

        const appBridge = getAppBridgeBlockStub({
            blockId: 1,
        });
        // @ts-expect-error Stubbing
        appBridge.getDocumentGroups = cy.stub().returns([]);
        // @ts-expect-error Stubbing
        appBridge.getAllDocuments = cy.stub().returns(Promise.resolve(apiDocuments));
        // @ts-expect-error Stubbing
        appBridge.getDocumentPagesByDocumentId = cy.stub().returns(Promise.resolve(apiPages));
        // @ts-expect-error Stubbing
        appBridge.getDocumentSectionsByDocumentPageId = cy.stub().returns(Promise.resolve(apiSections));

        mount(<LinkSelector appBridge={appBridge} url="/7" onUrlChange={cy.stub()} />);
        cy.get(LinkSelectorButtonSelector).click();
        cy.get(SectionLinkSelector).should('have.length', 4);
    });

    it('renders the all section and they are shown on focus and stores if you press enter', async () => {
        const { getAppBridgeBlockStub } = await getAppBridgeTestingPackage();

        const appBridge = getAppBridgeBlockStub({
            blockId: 1,
        });
        // @ts-expect-error Stubbing
        appBridge.getDocumentGroups = cy.stub().returns([]);
        // @ts-expect-error Stubbing
        appBridge.getAllDocuments = cy.stub().returns(Promise.resolve(apiDocuments));
        // @ts-expect-error Stubbing
        appBridge.getDocumentPagesByDocumentId = cy.stub().returns(Promise.resolve(apiPages));
        // @ts-expect-error Stubbing
        appBridge.getDocumentSectionsByDocumentPageId = cy.stub().returns(Promise.resolve(apiSections));

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
