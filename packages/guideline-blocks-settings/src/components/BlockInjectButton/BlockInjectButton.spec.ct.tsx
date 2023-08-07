/* (c) Copyright Frontify Ltd., all rights reserved. */

import { withAppBridgeBlockStubs } from '@frontify/app-bridge';
import { mount } from 'cypress/react18';
import { BlockInjectButton } from './BlockInjectButton';
import { IconAdobeCreativeCloud } from '@frontify/fondue';

const BlockInjectButtonSelector = '[data-test-id="block-inject-button"]';
const ActionMenuItemSelector = '[data-test-id="menu-item"]';

describe('Block Inject Button', () => {
    it('renders a simple block inject button', () => {
        const [BlockInjectButtonWithStubs] = withAppBridgeBlockStubs(BlockInjectButton, {});

        mount(
            <BlockInjectButtonWithStubs
                label="label"
                icon={<IconAdobeCreativeCloud />}
                secondaryLabel="second label"
                withMenu={false}
            />,
        );
        cy.get(BlockInjectButtonSelector)
            .should('exist')
            .should('have.class', 'first:tw-rounded-tl last:tw-rounded-br', 'first:tw-rounded-bl last:tw-rounded-tr');
    });

    it('renders a block inject button with Menu upload and asset', () => {
        const [BlockInjectButtonWithStubs] = withAppBridgeBlockStubs(BlockInjectButton, {});

        mount(
            <BlockInjectButtonWithStubs
                label="label"
                secondaryLabel="second label"
                onAssetChooseClick={cy.stub().as('onClickOpenAssetChooser')}
                onUploadClick={cy.stub().as('onClickonUploadClick')}
            />,
        );
        cy.get(BlockInjectButtonSelector).click();
        cy.get(ActionMenuItemSelector).should('have.length', 2);
        cy.get(ActionMenuItemSelector).eq(0).should('have.text', 'Upload asset').click();
        cy.get('@onClickonUploadClick').should('have.been.calledOnce');

        cy.get(BlockInjectButtonSelector).click();
        cy.get(ActionMenuItemSelector).eq(1).should('have.text', 'Browse asset').click();
        cy.get('@onClickOpenAssetChooser').should('have.been.calledOnce');
    });
});
