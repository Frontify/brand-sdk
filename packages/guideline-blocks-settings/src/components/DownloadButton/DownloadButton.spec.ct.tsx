/* (c) Copyright Frontify Ltd., all rights reserved. */

import { mount } from 'cypress/react18';
import { DownloadButton } from '.';

const DownloadButtonSelector = '[data-test-id="download-button"]';

describe('DownloadButton', () => {
    it('renders component', () => {
        mount(<DownloadButton onDownload={cy.stub()} />);
        cy.get(DownloadButtonSelector).should('exist');
    });

    it('calls onDownload on click', () => {
        const onDownloadStub = cy.stub().as('downloadStub');
        mount(<DownloadButton onDownload={onDownloadStub} />);
        cy.get(DownloadButtonSelector).click();
        cy.get('@downloadStub').should('have.been.called');
    });
});
