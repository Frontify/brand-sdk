/* (c) Copyright Frontify Ltd., all rights reserved. */

import { cleanup, render } from '@testing-library/react';
import sinon from 'sinon';
import { afterEach, describe, it } from 'vitest';

import { type AppBridgeBlock } from '../AppBridgeBlock';
import { TemplateLegacyDummy } from '../tests/TemplateLegacyDummy';
import { withAppBridgeBlockStubs } from '../tests/withAppBridgeBlockStubs';
import { type TemplateLegacy } from '../types/TemplateLegacy';

import { useTemplateChooser } from './useTemplateChooser';

const OPEN_TEMPLATE_CHOOSER_BUTTON_ID = 'open-template-chooser';
const CLOSE_TEMPLATE_CHOOSER_BUTTON_ID = 'close-template-chooser';

const TemplateChooserDummy = ({
    appBridge,
    onTemplateChosen,
}: {
    appBridge: AppBridgeBlock;
    onTemplateChosen?: (selectedTemplate: TemplateLegacy) => void;
}) => {
    const { openTemplateChooser, closeTemplateChooser } = useTemplateChooser(appBridge);

    return (
        <>
            <button
                data-test-id={OPEN_TEMPLATE_CHOOSER_BUTTON_ID}
                onClick={() => openTemplateChooser(onTemplateChosen ?? (() => null))}
                type="button"
            />
            <button
                data-test-id={CLOSE_TEMPLATE_CHOOSER_BUTTON_ID}
                onClick={() => closeTemplateChooser()}
                type="button"
            />
        </>
    );
};

describe('useReadyForPrint hook', () => {
    afterEach(() => {
        cleanup();
    });

    it('should open the template chooser', () => {
        const [BlockWithStubs, appBridge] = withAppBridgeBlockStubs(TemplateChooserDummy);
        const { getByTestId } = render(<BlockWithStubs />);
        const openTemplateChooserButton = getByTestId(OPEN_TEMPLATE_CHOOSER_BUTTON_ID) as HTMLButtonElement;
        openTemplateChooserButton.click();
        sinon.assert.calledWith(appBridge.dispatch, sinon.match.has('name', 'openTemplateChooser'));
    });

    it('should close the template chooser', () => {
        const [BlockWithStubs, appBridge] = withAppBridgeBlockStubs(TemplateChooserDummy);
        const { getByTestId } = render(<BlockWithStubs />);
        const closeTemplateChooserButton = getByTestId(CLOSE_TEMPLATE_CHOOSER_BUTTON_ID) as HTMLButtonElement;
        closeTemplateChooserButton.click();
        sinon.assert.calledWith(appBridge.dispatch, sinon.match.has('name', 'closeTemplateChooser'));
    });

    it('should call the onTemplateChosen callback when an template is chosen', () => {
        const [BlockWithStubs] = withAppBridgeBlockStubs(TemplateChooserDummy);
        const onTemplateChosen = sinon.spy();
        const { getByTestId } = render(<BlockWithStubs onTemplateChosen={onTemplateChosen} />);
        const openTemplateChooserButton = getByTestId(OPEN_TEMPLATE_CHOOSER_BUTTON_ID) as HTMLButtonElement;
        openTemplateChooserButton.click();
        sinon.assert.calledWith(onTemplateChosen, TemplateLegacyDummy.with(234));
    });

    it('should unsubscribe if template chooser gets opened and closed', () => {
        const unsubscribeSpy = sinon.spy();
        const [BlockWithStubs] = withAppBridgeBlockStubs(TemplateChooserDummy, { unsubscribe: unsubscribeSpy });
        const { getByTestId } = render(<BlockWithStubs />);
        const openTemplateChooserButton = getByTestId(OPEN_TEMPLATE_CHOOSER_BUTTON_ID) as HTMLButtonElement;
        openTemplateChooserButton.click();
        const closeTemplateChooserButton = getByTestId(CLOSE_TEMPLATE_CHOOSER_BUTTON_ID) as HTMLButtonElement;
        closeTemplateChooserButton.click();
        sinon.assert.calledOnce(unsubscribeSpy);
    });
});
