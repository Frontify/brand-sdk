/* (c) Copyright Frontify Ltd., all rights reserved. */

import { act, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { RichTextEditor } from './RichTextEditor';

const RTE_HTML_TEST_ID = 'rte-content-html';
const RICH_TEXT_EDITOR_TEST_ID = 'rich-text-editor';
const RICH_TEXT_CONTAINER_TEST_ID = 'rich-text-editor-container';
const EDITABLE_SELECTOR = '[contenteditable="true"]';
const TOOLBAR_SELECTOR = '[role="toolbar"]';

const PARAGRAPH = JSON.stringify([{ type: 'p', children: [{ text: 'Hello there!' }] }]);
const HEADING = JSON.stringify([{ type: 'heading1', children: [{ text: 'Test Heading' }] }]);
const UNKNOWN_MARK = JSON.stringify([{ type: 'p', children: [{ text: 'Lossy text', highlight: 'yellow' }] }]);

/**
 * happy-dom does not lay elements out, so `IntersectionObserver` never reports anything. This stub
 * lets each test decide when the observed element enters the viewport.
 */
class IntersectionObserverStub {
    static instances: IntersectionObserverStub[] = [];

    constructor(private readonly callback: IntersectionObserverCallback) {
        IntersectionObserverStub.instances.push(this);
    }

    observe() {}
    unobserve() {}
    disconnect() {}

    enterViewport() {
        this.callback([{ isIntersecting: true } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
    }
}

const enterViewport = async () => {
    await act(async () => {
        for (const instance of IntersectionObserverStub.instances) {
            instance.enterViewport();
        }
        await Promise.resolve();
    });
};

describe('RichTextEditor', () => {
    beforeEach(() => {
        IntersectionObserverStub.instances = [];
        vi.stubGlobal('IntersectionObserver', IntersectionObserverStub);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('should render an editable rich text editor in edit mode', async () => {
        render(<RichTextEditor isEditing value={PARAGRAPH} />);

        await enterViewport();

        const editor = await screen.findByTestId(RICH_TEXT_EDITOR_TEST_ID);
        await waitFor(() => {
            expect(editor.querySelector(EDITABLE_SELECTOR)).toBeInTheDocument();
        });
        expect(editor).toHaveTextContent('Hello there!');
    });

    it('should only render a rich text editor once it has entered the viewport while editing', async () => {
        render(<RichTextEditor isEditing value={PARAGRAPH} />);

        expect(await screen.findByTestId(RTE_HTML_TEST_ID)).toHaveTextContent('Hello there!');
        expect(screen.queryByTestId(RICH_TEXT_EDITOR_TEST_ID)).not.toBeInTheDocument();

        await enterViewport();

        expect(await screen.findByTestId(RICH_TEXT_EDITOR_TEST_ID)).toBeInTheDocument();
        expect(screen.queryByTestId(RTE_HTML_TEST_ID)).not.toBeInTheDocument();
    });

    it('should render the read only view when not editing', async () => {
        render(<RichTextEditor isEditing={false} value={HEADING} />);

        expect(await screen.findByTestId(RTE_HTML_TEST_ID)).toHaveTextContent('Test Heading');
        expect(screen.queryByTestId(RICH_TEXT_EDITOR_TEST_ID)).not.toBeInTheDocument();
    });

    it('should render a html value in the read only view', async () => {
        render(<RichTextEditor isEditing={false} value="<p>Test Paragraph</p>" />);

        expect(await screen.findByTestId(RTE_HTML_TEST_ID)).toHaveTextContent('Test Paragraph');
    });

    it('should render a plain text value in the read only view', async () => {
        render(<RichTextEditor isEditing={false} value="test" />);

        expect(await screen.findByTestId(RTE_HTML_TEST_ID)).toHaveTextContent('test');
    });

    it.each([
        ['empty', ''],
        ['undefined', undefined],
    ])('should not render the read only view when the value is %s', (_name, value) => {
        render(<RichTextEditor isEditing={false} value={value} />);

        expect(screen.queryByTestId(RTE_HTML_TEST_ID)).not.toBeInTheDocument();
    });

    it('should not render the read only view when show serialized text is off', () => {
        render(<RichTextEditor isEditing={false} value={PARAGRAPH} showSerializedText={false} />);

        expect(screen.queryByTestId(RTE_HTML_TEST_ID)).not.toBeInTheDocument();
    });

    it('should draw no toolbar and keep the content editable when the toolbar is off', async () => {
        render(<RichTextEditor isEditing value={PARAGRAPH} showToolbar={false} />);

        await enterViewport();

        const editor = await screen.findByTestId(RICH_TEXT_EDITOR_TEST_ID);
        await waitFor(() => {
            expect(editor.querySelector(EDITABLE_SELECTOR)).toBeInTheDocument();
        });
        expect(editor.querySelector(TOOLBAR_SELECTOR)).not.toBeInTheDocument();
        expect(screen.queryByRole('toolbar')).not.toBeInTheDocument();
    });

    it('should show a value that the editor would lose something from without making it editable', async () => {
        render(<RichTextEditor isEditing value={UNKNOWN_MARK} />);

        await enterViewport();

        expect(await screen.findByTestId(RTE_HTML_TEST_ID)).toHaveTextContent('Lossy text');
        expect(screen.queryByTestId(RICH_TEXT_EDITOR_TEST_ID)).not.toBeInTheDocument();
        expect(document.querySelector('[contenteditable]')).not.toBeInTheDocument();
    });

    it('should render the columns layout in edit mode', async () => {
        render(<RichTextEditor isEditing columns={4} gap="30px" value={PARAGRAPH} />);

        await enterViewport();

        const editor = await screen.findByTestId(RICH_TEXT_EDITOR_TEST_ID);
        await waitFor(() => {
            expect(editor.querySelector(EDITABLE_SELECTOR)).toBeInTheDocument();
        });

        expect(screen.getByTestId(RICH_TEXT_CONTAINER_TEST_ID)).toHaveClass('tw-@container');
        expect(editor.querySelector(EDITABLE_SELECTOR)).toHaveStyle({
            '--rte-columns': '4',
            '--rte-column-gap': '30px',
        });
    });

    it('should render the columns layout in the read only view', async () => {
        render(<RichTextEditor isEditing={false} columns={4} gap="30px" value={PARAGRAPH} />);

        const content = await screen.findByTestId(RTE_HTML_TEST_ID);

        expect(content.firstElementChild).toHaveStyle({ '--rte-columns': '4', '--rte-column-gap': '30px' });
    });
});
