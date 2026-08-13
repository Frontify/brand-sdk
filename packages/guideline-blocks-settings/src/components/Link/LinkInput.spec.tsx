/* (c) Copyright Frontify Ltd., all rights reserved. */

import { withAppBridgeBlockStubs } from '@frontify/app-bridge';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { LinkInput } from './LinkInput';

const LINK_INPUT_TEST_ID = 'link-input';
const TEXT_INPUT_TEST_ID = 'text-input';
const INPUT_LABEL_CONTAINER_TEST_ID = 'input-label-container';
const DIALOG_TRIGGER_TEST_ID = 'fondue-dialog-trigger';
const CHECKBOX_TEST_ID = 'fondue-checkbox';

const renderLinkInput = (props: Partial<Parameters<typeof LinkInput>[0]> = {}) => {
    const [LinkInputWithStubs] = withAppBridgeBlockStubs(LinkInput, {});
    return render(<LinkInputWithStubs {...props} />);
};

const getTextInput = () => within(screen.getByTestId(TEXT_INPUT_TEST_ID)).getByRole('textbox');

describe('Link Input', () => {
    it('should render the link input', () => {
        renderLinkInput();

        expect(screen.getByTestId(LINK_INPUT_TEST_ID)).toBeInTheDocument();
    });

    it('should render the label, placeholder and info of the link input', () => {
        renderLinkInput({ label: 'Custom Label', info: 'Custom Info', placeholder: 'Custom Placeholder' });

        expect(screen.getByTestId(LINK_INPUT_TEST_ID)).toBeInTheDocument();
        expect(screen.getByTestId(INPUT_LABEL_CONTAINER_TEST_ID)).toHaveTextContent('Custom Label');
        expect(screen.getByTestId(INPUT_LABEL_CONTAINER_TEST_ID)).toHaveTextContent('Custom Info');
        expect(getTextInput()).toHaveAttribute('placeholder', 'Custom Placeholder');
    });

    it('should render the link input with a valid url', () => {
        renderLinkInput({ url: 'https://example.com' });

        expect(screen.getByTestId(LINK_INPUT_TEST_ID)).toBeInTheDocument();
        expect(getTextInput()).toHaveValue('https://example.com');
    });

    it('should toggle the checkbox on click', async () => {
        const onToggleTab = vi.fn();
        renderLinkInput({ onToggleTab, url: 'https://frontify.com', newTab: false });

        const checkbox = screen.getByTestId(CHECKBOX_TEST_ID);
        expect(checkbox).toHaveAttribute('data-state', 'unchecked');

        await userEvent.click(checkbox);

        expect(onToggleTab).toHaveBeenCalledWith(true);
    });

    it('should toggle the checkbox on click if it is already checked', async () => {
        const onToggleTab = vi.fn();
        renderLinkInput({ onToggleTab, url: 'https://frontify.com', newTab: true });

        const checkbox = screen.getByTestId(CHECKBOX_TEST_ID);
        expect(checkbox).toHaveAttribute('data-state', 'checked');

        await userEvent.click(checkbox);

        expect(onToggleTab).toHaveBeenCalledWith(false);
    });

    it('should report the typed url', async () => {
        const onUrlChange = vi.fn();
        const [LinkInputWithStubs] = withAppBridgeBlockStubs(LinkInput, {});

        const ControlledLinkInput = () => {
            const [url, setUrl] = useState('');
            return (
                <LinkInputWithStubs
                    url={url}
                    onUrlChange={(value: string) => {
                        setUrl(value);
                        onUrlChange(value);
                    }}
                />
            );
        };

        render(<ControlledLinkInput />);

        await userEvent.type(getTextInput(), 'https://frontify.com');

        expect(onUrlChange).toHaveBeenLastCalledWith('https://frontify.com');
        expect(getTextInput()).toHaveValue('https://frontify.com');
    });

    it('should show the internal link button', () => {
        renderLinkInput();

        expect(screen.getByTestId(DIALOG_TRIGGER_TEST_ID)).toBeInTheDocument();
    });

    it('should not show the internal link button if it is hidden', () => {
        renderLinkInput({ hideInternalLinkButton: true });

        expect(screen.queryByTestId(DIALOG_TRIGGER_TEST_ID)).not.toBeInTheDocument();
    });

    it('should render an asterisk if the input is required', () => {
        renderLinkInput({ required: true, label: 'Link' });

        expect(screen.getByTestId(INPUT_LABEL_CONTAINER_TEST_ID)).toHaveTextContent('*');
    });
});
