/* (c) Copyright Frontify Ltd., all rights reserved. */

import { mount } from 'cypress/react18';

import { DownloadButton } from '.';

const DownloadButtonSelector = '[data-test-id="download-button"]';

describe('DownloadButton', () => {
    it('should render component', () => {
        mount(<DownloadButton onDownload={cy.stub()} />);
        cy.get(DownloadButtonSelector).should('exist');
    });

    it('should call onDownload on click', () => {
        const onDownloadStub = cy.stub().as('downloadStub');
        mount(<DownloadButton onDownload={onDownloadStub} />);
        cy.get(DownloadButtonSelector).click();
        cy.get('@downloadStub').should('have.been.called');
    });

    it('should have default aria-label', () => {
        mount(<DownloadButton onDownload={cy.stub()} />);
        cy.get(DownloadButtonSelector).should('have.attr', 'aria-label', 'Download');
    });

    it('should accepts custom aria-label', () => {
        const customAriaLabel = 'Custom Download Label';
        mount(<DownloadButton onDownload={cy.stub()} ariaLabel={customAriaLabel} />);
        cy.get(DownloadButtonSelector).should('have.attr', 'aria-label', customAriaLabel);
    });
});
