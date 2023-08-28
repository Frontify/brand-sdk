/* (c) Copyright Frontify Ltd., all rights reserved. */

import { withAppBridgeBlockStubs } from '@frontify/app-bridge';
import { mount } from 'cypress/react18';
import { LinkInput } from './LinkInput';
import { ButtonSize, CheckboxState } from '@frontify/fondue';

const LINK_INPUT_ID = '[data-test-id="link-input"]';
const TEXT_INPUT_ID = '[data-test-id="text-input"]';
const INPUT_LABEL_CONTAINER_ID = '[data-test-id="input-label-container"]';
const BUTTON_ID = '[data-test-id="button"]';
const CLEAR_ICON_ID = '[data-test-id="clear-icon"]';
const CHECKBOX_ID = '[data-test-id="checkbox-input"]';

describe('Link Input', () => {
    it('renders the link input', () => {
        const [LinkInputWithStubs] = withAppBridgeBlockStubs(LinkInput, {});
        mount(<LinkInputWithStubs />);
        cy.get(LINK_INPUT_ID).should('exist');
    });

    it('renders the link inpus label, placeholder and info', () => {
        const [LinkInputWithStubs] = withAppBridgeBlockStubs(LinkInput, {});
        mount(<LinkInputWithStubs label="Custom Label" info="Custom Info" placeholder="Custom Placeholder" />);
        cy.get(LINK_INPUT_ID).should('exist');
        cy.get(INPUT_LABEL_CONTAINER_ID).contains('Custom Label');
        cy.get(INPUT_LABEL_CONTAINER_ID).contains('Custom Info');
        cy.get(TEXT_INPUT_ID).should('have.attr', 'placeholder', 'Custom Placeholder');
    });

    it('renders the link inpu with a valid url', () => {
        const [LinkInputWithStubs] = withAppBridgeBlockStubs(LinkInput, {});
        mount(<LinkInputWithStubs url="https://example.com" />);
        cy.get(LINK_INPUT_ID).should('exist');
        cy.get(TEXT_INPUT_ID).should('have.value', 'https://example.com');
    });

    it('renders with clear icon', () => {
        const [LinkInputWithStubs] = withAppBridgeBlockStubs(LinkInput, {});
        mount(<LinkInputWithStubs url="https://frontify.com" clearable />);

        cy.get(CLEAR_ICON_ID).should('exist');
    });

    it('renders without clear icon', () => {
        const [LinkInputWithStubs] = withAppBridgeBlockStubs(LinkInput, {});
        mount(<LinkInputWithStubs clearable={false} />);

        cy.get(TEXT_INPUT_ID).click({ force: true });
        cy.get(TEXT_INPUT_ID).type('https://frontify.com').type('{enter}');
        cy.get(CLEAR_ICON_ID).should('not.exist');
    });

    it('toggles checkbox on click', () => {
        const [LinkInputWithStubs] = withAppBridgeBlockStubs(LinkInput, {});
        mount(
            <LinkInputWithStubs
                onToggleTab={cy.stub().as('onToggleTab')}
                url="https://frontify.com"
                openInNewTab={false}
            />,
        );

        cy.get(CHECKBOX_ID).should('not.be.checked');
        cy.get(CHECKBOX_ID).click({ force: true });
        cy.get('@onToggleTab').should('be.called.with', true);
    });

    it('toggles checkbox on click if its already checked', () => {
        const [LinkInputWithStubs] = withAppBridgeBlockStubs(LinkInput, {});
        mount(<LinkInputWithStubs onToggleTab={cy.stub().as('onToggleTab')} url="https://frontify.com" openInNewTab />);

        cy.get(CHECKBOX_ID).should('be.checked');
        cy.get(CHECKBOX_ID).click({ force: true });
        cy.get('@onToggleTab').should('be.called.with', false);
    });

    it('handles "Checked" state from newTab', () => {
        const [LinkInputWithStubs] = withAppBridgeBlockStubs(LinkInput, {});
        mount(
            <LinkInputWithStubs
                onToggleTab={cy.stub().as('onToggleTab')}
                url="https://frontify.com"
                newTab={CheckboxState.Checked}
            />,
        );
        cy.get(CHECKBOX_ID).should('be.checked');
        cy.get(CHECKBOX_ID).click({ force: true });
        cy.get('@onToggleTab').should('be.called.with', false);
    });

    it('handles "Unchecked" state from newTab', () => {
        const [LinkInputWithStubs] = withAppBridgeBlockStubs(LinkInput, {});
        mount(
            <LinkInputWithStubs
                onToggleTab={cy.stub().as('onToggleTab')}
                url="https://frontify.com"
                newTab={CheckboxState.Unchecked}
            />,
        );
        cy.get(CHECKBOX_ID).should('not.be.checked');
        cy.get(CHECKBOX_ID).click({ force: true });
        cy.get('@onToggleTab').should('be.called.with', true);
    });

    it('types into search field', () => {
        const [LinkInputWithStubs] = withAppBridgeBlockStubs(LinkInput, {});
        mount(<LinkInputWithStubs onUrlChange={cy.stub().as('onUrlChange')} />);

        cy.get(TEXT_INPUT_ID).click({ force: true });
        cy.get(TEXT_INPUT_ID).type('https://frontify.com');
        cy.get('@onUrlChange').should('be.called.with', 'https://frontify.com');
    });

    it('shows internal link button', () => {
        const [LinkInputWithStubs] = withAppBridgeBlockStubs(LinkInput, {});
        mount(<LinkInputWithStubs />);

        cy.get(BUTTON_ID).should('exist');
    });

    it('hides internal link button', () => {
        const [LinkInputWithStubs] = withAppBridgeBlockStubs(LinkInput, {});
        mount(<LinkInputWithStubs hideInternalLinkButton />);

        cy.get(BUTTON_ID).should('not.exist');
    });

    it('renders * if input is required', () => {
        const [LinkInputWithStubs] = withAppBridgeBlockStubs(LinkInput, {});
        mount(<LinkInputWithStubs required label="Link" />);

        cy.get(INPUT_LABEL_CONTAINER_ID).contains('*');
    });

    it('renders custom buttonsize', () => {
        const [LinkInputWithStubs] = withAppBridgeBlockStubs(LinkInput, {});
        mount(<LinkInputWithStubs buttonSize={ButtonSize.Small} />);

        cy.get(BUTTON_ID).should('have.class', 'tw-text-body-small');
    });
});
