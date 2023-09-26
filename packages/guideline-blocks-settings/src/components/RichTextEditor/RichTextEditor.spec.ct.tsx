/* (c) Copyright Frontify Ltd., all rights reserved. */

import { DocumentApiDummy, getAppBridgeBlockStub } from '@frontify/app-bridge';
import { PluginComposer } from '@frontify/fondue';
import { mount } from 'cypress/react18';
import type { SinonStub } from 'sinon';
import { ButtonPlugin, LinkPlugin, RichTextEditor, TextStyles } from '.';
import { convertToRteValue } from '../../helpers';

const RteHtmlSelector = '[data-test-id="rte-content-html"]';
const RichTextSelector = '[data-test-id="rich-text-editor"]';
const ButtonSelector = '[data-test-id="button"]';
const CheckboxSelector = '[data-test-id="checkbox-icon-box"]';
const ToolbarButtonSelector = '[data-testid="ToolbarButton"]';
const InternalDocumentLinkSelector = '[data-test-id="internal-link-selector-document-link"]';
const FloatingLinkModalSelector = '[data-test-id="floating-link-insert"]';
const FloatingButtonModalSelector = '[data-test-id="floating-button-insert"]';
const UrlInputSelector = 'input[id="url"]';

const apiDocuments = [{ ...DocumentApiDummy.with(1), permanentLink: '/r/document' }];

const appBridge = getAppBridgeBlockStub({
    blockId: 1,
});

describe('RichTextEditor', () => {
    it('should render a rich text editor in edit mode', () => {
        mount(<RichTextEditor isEditing />);
        cy.get(RichTextSelector).should('exist');
    });

    it('should render a rich text html in view mode', () => {
        mount(<RichTextEditor isEditing={false} value="test" />);
        cy.get(RteHtmlSelector).should('exist');
    });

    it('should render a json value in view mode', () => {
        mount(<RichTextEditor isEditing={false} value={convertToRteValue(TextStyles.heading1, 'Test Heading')} />);
        cy.get(RteHtmlSelector).should('exist');
    });

    it('should render a html value in view mode', () => {
        mount(<RichTextEditor isEditing={false} value="<p>Test Paragraph</p>" />);
        cy.get(RteHtmlSelector).should('exist');
    });

    it('should not render html output if value is empty', () => {
        mount(<RichTextEditor isEditing={false} value="" />);
        cy.get(RteHtmlSelector).should('not.exist');
    });

    it('should not render html output if value is undefined', () => {
        mount(<RichTextEditor isEditing={false} />);
        cy.get(RteHtmlSelector).should('not.exist');
    });

    it('should be able to select internal link', () => {
        (appBridge.getDocumentGroups as SinonStub) = cy.stub().returns([]);
        (appBridge.getAllDocuments as SinonStub) = cy.stub().returns(Promise.resolve(apiDocuments));

        mount(
            <RichTextEditor
                isEditing={true}
                plugins={new PluginComposer().setPlugin([new LinkPlugin({ appBridge })])}
                value={convertToRteValue('p', 'This is a link')}
            />,
        );
        cy.get(RichTextSelector).click();
        cy.get(RichTextSelector).type('{selectall}');
        cy.get(ToolbarButtonSelector).click();
        cy.get(ButtonSelector).first().click();
        cy.get(InternalDocumentLinkSelector).click();
        cy.get(ButtonSelector).last().click();
        cy.get(FloatingLinkModalSelector).find(ButtonSelector).last().click();
        const linkTag = cy.get(RichTextSelector).find('a[href="/r/document"]');
        linkTag.should('exist');
        linkTag.should('have.attr', 'target', '_self');
    });

    it('should be able to select internal link with target blank', () => {
        (appBridge.getDocumentGroups as SinonStub) = cy.stub().returns([]);
        (appBridge.getAllDocuments as SinonStub) = cy.stub().returns(Promise.resolve(apiDocuments));

        mount(
            <RichTextEditor
                isEditing={true}
                plugins={new PluginComposer().setPlugin([new LinkPlugin({ appBridge })])}
                value={convertToRteValue('p', 'This is a link')}
            />,
        );
        cy.get(RichTextSelector).click();
        cy.get(RichTextSelector).type('{selectall}');
        cy.get(ToolbarButtonSelector).click();
        cy.get(ButtonSelector).first().click();
        cy.get(InternalDocumentLinkSelector).click();
        cy.get(ButtonSelector).last().click();
        cy.get(CheckboxSelector).click();
        cy.get(FloatingLinkModalSelector).find(ButtonSelector).last().click();
        const linkTag = cy.get(RichTextSelector).find('a[href="/r/document"]');
        linkTag.should('exist');
        linkTag.should('have.attr', 'target', '_blank');
    });

    it('should prepend the URL with https:// if not exists', () => {
        (appBridge.getDocumentGroups as SinonStub) = cy.stub().returns([]);
        (appBridge.getAllDocuments as SinonStub) = cy.stub().returns(Promise.resolve(apiDocuments));

        mount(
            <RichTextEditor
                isEditing={true}
                plugins={new PluginComposer().setPlugin([new LinkPlugin({ appBridge })])}
                value={convertToRteValue('p', 'This is a link')}
            />,
        );
        cy.get(RichTextSelector).click();
        cy.get(RichTextSelector).type('{selectall}');
        cy.get(ToolbarButtonSelector).click();
        cy.get(UrlInputSelector).type('frontify.com');
        cy.get(FloatingLinkModalSelector).find(ButtonSelector).last().click();
        cy.get(RichTextSelector).find('a[href="https://frontify.com"]').should('exist');
    });

    it('should allow URLs that start with /document/', () => {
        (appBridge.getDocumentGroups as SinonStub) = cy.stub().returns([]);
        (appBridge.getAllDocuments as SinonStub) = cy.stub().returns(Promise.resolve(apiDocuments));

        mount(
            <RichTextEditor
                isEditing={true}
                plugins={new PluginComposer().setPlugin([new LinkPlugin({ appBridge })])}
                value={convertToRteValue('p', 'This is a link')}
            />,
        );

        cy.get(RichTextSelector).click();
        cy.get(RichTextSelector).type('{selectall}');
        cy.get(ToolbarButtonSelector).click();
        cy.get(UrlInputSelector).type('/document/test');
        cy.get(FloatingLinkModalSelector).find(ButtonSelector).last().click();
        cy.get(RichTextSelector).find('a[href="/document/test"]').should('exist');
    });

    it('should not add https:// to the URL for mailto: links', () => {
        (appBridge.getDocumentGroups as SinonStub) = cy.stub().returns([]);
        (appBridge.getAllDocuments as SinonStub) = cy.stub().returns(Promise.resolve(apiDocuments));

        mount(
            <RichTextEditor
                isEditing={true}
                plugins={new PluginComposer().setPlugin([new LinkPlugin({ appBridge })])}
                value={convertToRteValue('p', 'This is a link')}
            />,
        );
        cy.get(RichTextSelector).click();
        cy.get(RichTextSelector).type('{selectall}');
        cy.get(ToolbarButtonSelector).click();
        cy.get(UrlInputSelector).type('mailto:info@frontify.com');
        cy.get(FloatingLinkModalSelector).find(ButtonSelector).last().click();
        cy.get(RichTextSelector).find('a[href="mailto:info@frontify.com"]').should('exist');
    });

    it('should create a link with a link typed in the RTE', () => {
        (appBridge.getDocumentGroups as SinonStub) = cy.stub().returns([]);
        (appBridge.getAllDocuments as SinonStub) = cy.stub().returns(Promise.resolve(apiDocuments));

        mount(
            <RichTextEditor
                isEditing={true}
                plugins={new PluginComposer().setPlugin([new LinkPlugin({ appBridge })])}
            />,
        );
        cy.get(RichTextSelector).click();
        cy.get(RichTextSelector).type('mailto:info@frontify.com {enter}');
        cy.get(RichTextSelector).find('a[href="mailto:info@frontify.com"]').should('exist');
    });

    it('should not create a link with a : after a word', () => {
        (appBridge.getDocumentGroups as SinonStub) = cy.stub().returns([]);
        (appBridge.getAllDocuments as SinonStub) = cy.stub().returns(Promise.resolve(apiDocuments));

        mount(
            <RichTextEditor
                isEditing={true}
                plugins={new PluginComposer().setPlugin([new LinkPlugin({ appBridge })])}
            />,
        );
        cy.get(RichTextSelector).click();
        cy.get(RichTextSelector).type('list:{enter}');
        cy.get(RichTextSelector).find('a').should('not.exist');
    });

    it('should allow URLs that start with /document/', () => {
        (appBridge.getDocumentGroups as SinonStub) = cy.stub().returns([]);
        (appBridge.getAllDocuments as SinonStub) = cy.stub().returns(Promise.resolve(apiDocuments));

        mount(
            <RichTextEditor
                isEditing={true}
                plugins={new PluginComposer().setPlugin([new LinkPlugin({ appBridge })])}
                value={convertToRteValue('p', 'This is a link')}
            />,
        );
        cy.get(RichTextSelector).click();
        cy.get(RichTextSelector).type('{selectall}');
        cy.get(ToolbarButtonSelector).click();
        cy.get(UrlInputSelector).type('/document/test');
        cy.get(FloatingLinkModalSelector).find(ButtonSelector).last().click();
        cy.get(RichTextSelector).find('a[href="/document/test"]').should('exist');
    });

    it('should be able to select internal button link', () => {
        (appBridge.getDocumentGroups as SinonStub) = cy.stub().returns([]);
        (appBridge.getAllDocuments as SinonStub) = cy.stub().returns(Promise.resolve(apiDocuments));

        mount(
            <RichTextEditor
                isEditing={true}
                plugins={new PluginComposer().setPlugin([new ButtonPlugin({ appBridge })])}
                value={convertToRteValue('p', 'This is a button')}
            />,
        );
        cy.get(RichTextSelector).click();
        cy.get(RichTextSelector).type('{selectall}');
        cy.get(ToolbarButtonSelector).click();
        cy.get(ButtonSelector).first().click();
        cy.get(InternalDocumentLinkSelector).click();
        cy.get(ButtonSelector).last().click();
        cy.get(FloatingButtonModalSelector).find(ButtonSelector).last().click();
        cy.get(RichTextSelector).find('a[href="/r/document"]').should('exist');
    });
});
