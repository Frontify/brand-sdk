/* (c) Copyright Frontify Ltd., all rights reserved. */

import { cleanup, render } from '@testing-library/react';
import sinon from 'sinon';
import { afterEach, describe, it } from 'vitest';

import { type AppBridgeBlock } from '../AppBridgeBlock';
import { withAppBridgeBlockStubs } from '../tests/withAppBridgeBlockStubs';

import { useLinkChooser } from './useLinkChooser';

const OPEN_LINK_CHOOSER_BUTTON_ID = 'open-link-chooser';
const CLOSE_LINK_CHOOSER_BUTTON_ID = 'close-link-chooser';

const LinkChooserDummy = ({
    appBridge,
    onLinkChosen,
}: {
    appBridge: AppBridgeBlock;
    onLinkChosen?: (url: string) => void;
}) => {
    const { openLinkChooser, closeLinkChooser } = useLinkChooser(appBridge);

    return (
        <>
            <button
                data-test-id={OPEN_LINK_CHOOSER_BUTTON_ID}
                onClick={() => openLinkChooser(onLinkChosen ?? (() => null), {})}
                type="button"
            >
                Open Link Chooser
            </button>
            <button data-test-id={CLOSE_LINK_CHOOSER_BUTTON_ID} onClick={() => closeLinkChooser()} type="button">
                Close Link Chooser
            </button>
        </>
    );
};

describe('useLinkChooser hook', () => {
    afterEach(() => {
        cleanup();
    });

    it('should open the link chooser', () => {
        const [BlockWithStubs, appBridge] = withAppBridgeBlockStubs(LinkChooserDummy);
        const { getByTestId } = render(<BlockWithStubs />);
        const openLinkChooserButton = getByTestId(OPEN_LINK_CHOOSER_BUTTON_ID) as HTMLButtonElement;
        openLinkChooserButton.click();
        sinon.assert.calledWith(appBridge.dispatch, sinon.match.has('name', 'openLinkChooser'));
    });

    it('should close the link chooser', () => {
        const [BlockWithStubs, appBridge] = withAppBridgeBlockStubs(LinkChooserDummy);
        const { getByTestId } = render(<BlockWithStubs />);
        const closeLinkChooserButton = getByTestId(CLOSE_LINK_CHOOSER_BUTTON_ID) as HTMLButtonElement;
        closeLinkChooserButton.click();
        sinon.assert.calledWith(appBridge.dispatch, sinon.match.has('name', 'closeLinkChooser'));
    });

    it('should call the onLinkChosen callback when a link is chosen', () => {
        const [BlockWithStubs] = withAppBridgeBlockStubs(LinkChooserDummy);
        const onLinkChosen = sinon.spy();
        const { getByTestId } = render(<BlockWithStubs onLinkChosen={onLinkChosen} />);
        const openLinkChooserButton = getByTestId(OPEN_LINK_CHOOSER_BUTTON_ID) as HTMLButtonElement;
        openLinkChooserButton.click();
        sinon.assert.calledWith(onLinkChosen, 'https://example.com');
    });

    it('should unsubscribe if link chooser gets opened and closed', () => {
        const unsubscribeSpy = sinon.spy();
        const [BlockWithStubs] = withAppBridgeBlockStubs(LinkChooserDummy, { unsubscribe: unsubscribeSpy });
        const { getByTestId } = render(<BlockWithStubs />);
        const openLinkChooserButton = getByTestId(OPEN_LINK_CHOOSER_BUTTON_ID) as HTMLButtonElement;
        openLinkChooserButton.click();
        const closeLinkChooserButton = getByTestId(CLOSE_LINK_CHOOSER_BUTTON_ID) as HTMLButtonElement;
        closeLinkChooserButton.click();
        sinon.assert.calledOnce(unsubscribeSpy);
    });

    it('should unsubscribe the previous subscription if opened again without closing', () => {
        const unsubscribeSpy = sinon.spy();
        const [BlockWithStubs] = withAppBridgeBlockStubs(LinkChooserDummy, { unsubscribe: unsubscribeSpy });
        const { getByTestId } = render(<BlockWithStubs />);
        const openLinkChooserButton = getByTestId(OPEN_LINK_CHOOSER_BUTTON_ID) as HTMLButtonElement;
        openLinkChooserButton.click();
        openLinkChooserButton.click();
        sinon.assert.calledOnce(unsubscribeSpy);
    });

    it('should unsubscribe the previous subscription if opened again after a re-render without closing', () => {
        const unsubscribeSpy = sinon.spy();
        const [BlockWithStubs] = withAppBridgeBlockStubs(LinkChooserDummy, { unsubscribe: unsubscribeSpy });
        const { getByTestId, rerender } = render(<BlockWithStubs />);
        const openLinkChooserButton = getByTestId(OPEN_LINK_CHOOSER_BUTTON_ID) as HTMLButtonElement;
        openLinkChooserButton.click();
        rerender(<BlockWithStubs onLinkChosen={sinon.spy()} />);
        openLinkChooserButton.click();
        sinon.assert.calledOnce(unsubscribeSpy);
    });

    it('should unsubscribe a still-open subscription on unmount', () => {
        const unsubscribeSpy = sinon.spy();
        const [BlockWithStubs] = withAppBridgeBlockStubs(LinkChooserDummy, { unsubscribe: unsubscribeSpy });
        const { getByTestId, unmount } = render(<BlockWithStubs />);
        const openLinkChooserButton = getByTestId(OPEN_LINK_CHOOSER_BUTTON_ID) as HTMLButtonElement;
        openLinkChooserButton.click();
        unmount();
        sinon.assert.calledOnce(unsubscribeSpy);
    });
});
