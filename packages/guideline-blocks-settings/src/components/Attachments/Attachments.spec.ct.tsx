/* (c) Copyright Frontify Ltd., all rights reserved. */

import { AssetDummy, getAppBridgeBlockStub } from '@frontify/app-bridge';
import { mount } from 'cypress/react18';
import { Attachments as AttachmentsComponent } from './Attachments';
import { AttachmentsProps } from './types';
import type { SinonStub } from 'sinon';

const FlyoutButtonSelector = '[data-test-id="attachments-flyout-button"]';
const AssetInputSelector = '[data-test-id="asset-input-placeholder"]';
const ActionBarSelector = '[data-test-id="attachments-actionbar"]';
const DragHandleSelector = '[data-test-id="attachments-actionbar"] > button';
const FlyoutTriggerSelector = '[data-test-id="attachments-actionbar-flyout"] button';
const AttachmentItemSelector = '[data-test-id="attachments-item"]';
const MenuItemSelector = '[data-test-id="menu-item"]';
const LoadingCircleSelector = '[data-test-id="loading-circle"]';

const Attachments = ({
    appBridge = getAppBridgeBlockStub(),
    onDelete = cy.stub(),
    items,
    onReplaceWithBrowse = cy.stub(),
    onReplaceWithUpload = cy.stub(),
    onSorted = cy.stub(),
    onBrowse = cy.stub(),
    onUpload = cy.stub(),
}: Partial<AttachmentsProps>) => {
    return (
        <AttachmentsComponent
            appBridge={appBridge}
            onDelete={onDelete}
            items={items}
            onReplaceWithBrowse={onReplaceWithBrowse}
            onReplaceWithUpload={onReplaceWithUpload}
            onSorted={onSorted}
            onBrowse={onBrowse}
            onUpload={onUpload}
        />
    );
};

describe('Attachments', () => {
    it('renders attachments flyout if it is in edit mode', () => {
        mount(<Attachments appBridge={getAppBridgeBlockStub({ editorState: true })} />);
        cy.get(FlyoutButtonSelector).should('exist');
    });

    it('renders attachments flyout if it has attachments', () => {
        mount(<Attachments items={[AssetDummy.with(1)]} />);
        cy.get(FlyoutButtonSelector).should('exist');
    });

    it('does not render attachments flyout if there are no attachments', () => {
        mount(<Attachments items={[]} />);
        cy.get(FlyoutButtonSelector).should('not.exist');
    });

    it('renders asset input if in edit mode', () => {
        mount(<Attachments appBridge={getAppBridgeBlockStub({ editorState: true })} items={[AssetDummy.with(1)]} />);
        cy.get(FlyoutButtonSelector).click();
        cy.get(AssetInputSelector).should('exist');
    });

    it('does not render asset input if in view mode', () => {
        mount(<Attachments items={[AssetDummy.with(1)]} />);
        cy.get(FlyoutButtonSelector).click();
        cy.get(AssetInputSelector).should('not.exist');
    });

    it('renders asset action buttons if in edit mode', () => {
        mount(<Attachments appBridge={getAppBridgeBlockStub({ editorState: true })} items={[AssetDummy.with(1)]} />);
        cy.get(FlyoutButtonSelector).click();
        cy.get(ActionBarSelector).should('exist');
    });

    it('does not render asset action buttons if in view mode', () => {
        mount(<Attachments items={[AssetDummy.with(1)]} />);
        cy.get(FlyoutButtonSelector).click();
        cy.get(ActionBarSelector).should('not.exist');
    });

    it('renders an attachment item for each asset', () => {
        mount(<Attachments items={[AssetDummy.with(1), AssetDummy.with(2), AssetDummy.with(3)]} />);
        cy.get(FlyoutButtonSelector).click();
        cy.get(AttachmentItemSelector).should('have.length', 3);
    });

    it('renders loading circle for attachment item', () => {
        const appBridge = getAppBridgeBlockStub({
            editorState: true,
        });
        (appBridge.openAssetChooser as SinonStub) = cy.stub().callsArgWith(0, AssetDummy.with(4));

        cy.clock();
        const replaceStub = () =>
            new Promise<void>((resolve) =>
                setTimeout(() => {
                    resolve();
                }, 2000),
            );

        mount(
            <Attachments
                onReplaceWithBrowse={replaceStub}
                items={[AssetDummy.with(1), AssetDummy.with(2), AssetDummy.with(3)]}
                appBridge={appBridge}
            />,
        );

        cy.get(FlyoutButtonSelector).click();
        cy.get(AttachmentItemSelector).eq(0).focus();
        cy.get(FlyoutTriggerSelector).eq(1).click();
        cy.get(MenuItemSelector).eq(1).click();
        cy.get(LoadingCircleSelector).should('exist');
        cy.tick(2000);
        cy.get(LoadingCircleSelector).should('not.exist');
    });

    it('renders focus ring on flyout button while tabbing and open it', () => {
        mount(
            <Attachments
                appBridge={getAppBridgeBlockStub({ editorState: true })}
                items={[AssetDummy.with(1), AssetDummy.with(2), AssetDummy.with(3)]}
            />,
        );
        cy.get(FlyoutButtonSelector).click();
        cy.realPress('Tab');
        cy.realPress('Tab');
        cy.realPress('Tab');
        cy.get(FlyoutTriggerSelector).eq(0).should('have.class', 'focus-visible:tw-ring-blue');
        cy.get(FlyoutTriggerSelector).eq(0).type('{enter}');
        cy.get(MenuItemSelector).should('exist');
    });

    it('reorders items using only keyboard events', () => {
        const onSortStub = cy.stub();
        mount(
            <Attachments
                appBridge={getAppBridgeBlockStub({ editorState: true })}
                items={[{ ...AssetDummy.with(1), title: 'Moved item' }, AssetDummy.with(2), AssetDummy.with(3)]}
                onSorted={onSortStub}
            />,
        );
        cy.get(FlyoutButtonSelector).click();
        cy.realPress('Tab');
        cy.realPress('Tab');
        cy.realPress('Tab');
        cy.get(DragHandleSelector).eq(0).type(' {downarrow}{downarrow} ');
        cy.get(AttachmentItemSelector).eq(1).should('contain.text', 'Moved item');
    });
});
