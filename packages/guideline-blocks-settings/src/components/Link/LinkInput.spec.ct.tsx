/* (c) Copyright Frontify Ltd., all rights reserved. */

import { withAppBridgeBlockStubs } from '@frontify/app-bridge';

import { LinkInput } from './LinkInput';

const LINK_INPUT_ID = '[data-test-id="link-input"]';
const TEXT_INPUT_ID = '[data-test-id="text-input"] input';
const INPUT_LABEL_CONTAINER_ID = '[data-test-id="input-label-container"]';
const BUTTON_ID = '[data-test-id="fondue-dialog-trigger"]';
const CHECKBOX_ID = '[data-test-id="fondue-checkbox"]';

describe('Link Input', () => {
    it('renders the link input', () => {
        const [LinkInputWithStubs] = withAppBridgeBlockStubs(LinkInput, {});
        cy.mount(<LinkInputWithStubs />);
        cy.get(LINK_INPUT_ID).should('exist');
    });

    it('renders the link inpus label, placeholder and info', () => {
        const [LinkInputWithStubs] = withAppBridgeBlockStubs(LinkInput, {});
        cy.mount(<LinkInputWithStubs label="Custom Label" info="Custom Info" placeholder="Custom Placeholder" />);
        cy.get(LINK_INPUT_ID).should('exist');
        cy.get(INPUT_LABEL_CONTAINER_ID).contains('Custom Label');
        cy.get(INPUT_LABEL_CONTAINER_ID).contains('Custom Info');
        cy.get(TEXT_INPUT_ID).should('have.attr', 'placeholder', 'Custom Placeholder');
    });

    it('renders the link inpu with a valid url', () => {
        const [LinkInputWithStubs] = withAppBridgeBlockStubs(LinkInput, {});
        cy.mount(<LinkInputWithStubs url="https://example.com" />);
        cy.get(LINK_INPUT_ID).should('exist');
        cy.get(TEXT_INPUT_ID).should('have.value', 'https://example.com');
    });

    it('toggles checkbox on click', () => {
        const [LinkInputWithStubs] = withAppBridgeBlockStubs(LinkInput, {});
        cy.mount(
            <LinkInputWithStubs onToggleTab={cy.stub().as('onToggleTab')} url="https://frontify.com" newTab={false} />,
        );

        cy.get(CHECKBOX_ID).should('have.attr', 'data-state', 'unchecked');
        cy.get(CHECKBOX_ID).click({ force: true });
        cy.get('@onToggleTab').should('be.called.with', true);
    });

    it('toggles checkbox on click if its already checked', () => {
        const [LinkInputWithStubs] = withAppBridgeBlockStubs(LinkInput, {});
        cy.mount(<LinkInputWithStubs onToggleTab={cy.stub().as('onToggleTab')} url="https://frontify.com" newTab />);

        cy.get(CHECKBOX_ID).should('have.attr', 'data-state', 'checked');
        cy.get(CHECKBOX_ID).click({ force: true });
        cy.get('@onToggleTab').should('be.called.with', false);
    });

    it('handles "Checked" state from newTab', () => {
        const [LinkInputWithStubs] = withAppBridgeBlockStubs(LinkInput, {});
        cy.mount(<LinkInputWithStubs onToggleTab={cy.stub().as('onToggleTab')} url="https://frontify.com" newTab />);
        cy.get(CHECKBOX_ID).should('have.attr', 'data-state', 'checked');
        cy.get(CHECKBOX_ID).click({ force: true });
        cy.get('@onToggleTab').should('be.called.with', false);
    });

    it('handles "Unchecked" state from newTab', () => {
        const [LinkInputWithStubs] = withAppBridgeBlockStubs(LinkInput, {});
        cy.mount(
            <LinkInputWithStubs onToggleTab={cy.stub().as('onToggleTab')} url="https://frontify.com" newTab={false} />,
        );
        cy.get(CHECKBOX_ID).should('have.attr', 'data-state', 'unchecked');
        cy.get(CHECKBOX_ID).click({ force: true });
        cy.get('@onToggleTab').should('be.called.with', true);
    });

    it('types into search field', () => {
        const [LinkInputWithStubs] = withAppBridgeBlockStubs(LinkInput, {});
        cy.mount(<LinkInputWithStubs onUrlChange={cy.stub().as('onUrlChange')} />);

        cy.get(TEXT_INPUT_ID).click({ force: true });
        cy.get(TEXT_INPUT_ID).type('https://frontify.com');
        cy.get('@onUrlChange').should('be.called.with', 'https://frontify.com');
    });

    it('shows internal link button', () => {
        const [LinkInputWithStubs] = withAppBridgeBlockStubs(LinkInput, {});
        cy.mount(<LinkInputWithStubs />);

        cy.get(BUTTON_ID).should('exist');
    });

    it('hides internal link button', () => {
        const [LinkInputWithStubs] = withAppBridgeBlockStubs(LinkInput, {});
        cy.mount(<LinkInputWithStubs hideInternalLinkButton />);

        cy.get(BUTTON_ID).should('not.exist');
    });

    it('renders * if input is required', () => {
        const [LinkInputWithStubs] = withAppBridgeBlockStubs(LinkInput, {});
        cy.mount(<LinkInputWithStubs required label="Link" />);

        cy.get(INPUT_LABEL_CONTAINER_ID).contains('*');
    });
});
