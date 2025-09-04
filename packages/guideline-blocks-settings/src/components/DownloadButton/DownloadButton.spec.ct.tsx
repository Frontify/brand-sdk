/* (c) Copyright Frontify Ltd., all rights reserved. */

import { DownloadButton } from './DownloadButton';

const DownloadButtonSelector = '[data-test-id="download-button"]';

describe('DownloadButton', () => {
    it('should render component', () => {
        cy.mount(<DownloadButton onDownload={cy.stub()} />);
        cy.get(DownloadButtonSelector).should('exist');
    });

    it('should call onDownload on click', () => {
        const onDownloadStub = cy.stub().as('downloadStub');
        cy.mount(<DownloadButton onDownload={onDownloadStub} />);
        cy.get(DownloadButtonSelector).click();
        cy.get('@downloadStub').should('have.been.called');
    });

    it('should have default aria-label', () => {
        cy.mount(<DownloadButton onDownload={cy.stub()} />);
        cy.get(DownloadButtonSelector).should('have.attr', 'aria-label', 'Download');
    });

    it('should accepts custom aria-label', () => {
        const customAriaLabel = 'Custom Download Label';
        cy.mount(<DownloadButton onDownload={cy.stub()} ariaLabel={customAriaLabel} />);
        cy.get(DownloadButtonSelector).should('have.attr', 'aria-label', customAriaLabel);
    });
});
