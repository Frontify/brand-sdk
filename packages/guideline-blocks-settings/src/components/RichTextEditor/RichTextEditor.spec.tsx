/* (c) Copyright Frontify Ltd., all rights reserved. */

import { getAppBridgeBlockStub } from '@frontify/app-bridge/testing';
import { act, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getDefaultPluginsWithLinkChooser } from './pluginPresets';
import { RichTextEditor } from './RichTextEditor';
import { writeRichTextValue } from './richTextValue';

vi.mock('./richTextValue', async (importOriginal) => {
    const original = await importOriginal<Record<string, unknown>>();

    return { ...original, writeRichTextValue: vi.fn(original.writeRichTextValue as () => unknown) };
});

const RTE_HTML_TEST_ID = 'rte-content-html';
const RICH_TEXT_EDITOR_TEST_ID = 'rich-text-editor';
const RICH_TEXT_CONTAINER_TEST_ID = 'rich-text-editor-container';
const EDITABLE_SELECTOR = '[contenteditable="true"]';
const TOOLBAR_SELECTOR = '[role="toolbar"]';

const UNSAVED_MESSAGE_PART = 'cannot be saved yet';
const EDIT_SETTLE_MS = 50;

const PARAGRAPH = JSON.stringify([{ type: 'p', children: [{ text: 'Hello there!' }] }]);
const HEADING = JSON.stringify([{ type: 'heading1', children: [{ text: 'Test Heading' }] }]);
const INLINE_BUTTON = JSON.stringify([
    {
        type: 'p',
        children: [
            { text: 'Press ' },
            { type: 'button', url: 'https://example.com', buttonStyle: 'primary', children: [{ text: 'Go\nnow' }] },
            { text: '' },
        ],
    },
]);
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

const findEditable = async (): Promise<HTMLElement> => {
    const editor = await screen.findByTestId(RICH_TEXT_EDITOR_TEST_ID);

    return waitFor(() => {
        const editable = editor.querySelector<HTMLElement>(EDITABLE_SELECTOR);
        if (editable === null) {
            throw new Error('The editor is not editable yet');
        }

        return editable;
    });
};

const typeInto = async (editable: HTMLElement, text: string) => {
    await act(async () => {
        editable.focus();
        const paragraph = editable.querySelector('p');
        if (paragraph) {
            paragraph.textContent = text;
        }

        await new Promise((resolve) => setTimeout(resolve, EDIT_SETTLE_MS));
    });
};

const blur = async (editable: HTMLElement) => {
    await act(async () => {
        editable.blur();
        await new Promise((resolve) => setTimeout(resolve, EDIT_SETTLE_MS));
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

    it('should call onTextChange with the legacy value when the editor loses focus after a change', async () => {
        const onTextChange = vi.fn();
        render(<RichTextEditor isEditing value={PARAGRAPH} onTextChange={onTextChange} />);
        await enterViewport();
        const editable = await findEditable();

        await typeInto(editable, 'Hello world');
        await blur(editable);

        expect(onTextChange).toHaveBeenCalledWith(JSON.stringify([{ type: 'p', children: [{ text: 'Hello world' }] }]));
    });

    it('should show an error and not call onTextChange when the text cannot be saved, then clear it once it can', async () => {
        const onTextChange = vi.fn();
        vi.mocked(writeRichTextValue).mockReturnValueOnce({
            outcome: 'not-reversible',
            diagnostics: [{ code: 'no-legacy-form', path: [0] }],
        });
        render(<RichTextEditor isEditing value={PARAGRAPH} onTextChange={onTextChange} />);
        await enterViewport();
        const editable = await findEditable();

        await typeInto(editable, 'Hello world');
        await blur(editable);

        expect(screen.getByText(new RegExp(UNSAVED_MESSAGE_PART))).toBeInTheDocument();
        expect(editable).toHaveAttribute('aria-invalid', 'true');
        expect(onTextChange).not.toHaveBeenCalled();

        await typeInto(editable, 'Hello again');
        await blur(editable);

        expect(screen.queryByText(new RegExp(UNSAVED_MESSAGE_PART))).not.toBeInTheDocument();
        expect(onTextChange).toHaveBeenCalledOnce();
    });

    it('should keep what was typed when the parent hands the saved value back late', async () => {
        const onTextChange = vi.fn();
        const { rerender } = render(<RichTextEditor isEditing value={PARAGRAPH} onTextChange={onTextChange} />);
        await enterViewport();
        const editable = await findEditable();
        await typeInto(editable, 'Hello world');
        await blur(editable);
        const [savedValue] = onTextChange.mock.lastCall as [string];

        await typeInto(editable, 'Hello world!');
        rerender(<RichTextEditor isEditing value={savedValue} onTextChange={onTextChange} />);
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, EDIT_SETTLE_MS));
        });

        expect(editable).toHaveTextContent('Hello world!');
    });

    it('should send the original value when it is typed back before the first save is handed back', async () => {
        const onTextChange = vi.fn();
        render(<RichTextEditor isEditing value={PARAGRAPH} onTextChange={onTextChange} />);
        await enterViewport();
        const editable = await findEditable();

        await typeInto(editable, 'Hello world');
        await blur(editable);
        await typeInto(editable, 'Hello there!');
        await blur(editable);

        expect(onTextChange).toHaveBeenCalledTimes(2);
        expect(onTextChange).toHaveBeenLastCalledWith(PARAGRAPH);
    });

    it('should keep the text of an inline that no plugin declares in the read only view', async () => {
        const plugins = getDefaultPluginsWithLinkChooser(getAppBridgeBlockStub());
        render(<RichTextEditor isEditing={false} value={INLINE_BUTTON} plugins={plugins} />);

        const content = await screen.findByTestId(RTE_HTML_TEST_ID);

        expect(content).toHaveTextContent('Press Go');
        expect(content).toHaveTextContent('now');
    });

    it('should show a value that cannot be edited while editing even when the serialized text is off', async () => {
        render(<RichTextEditor isEditing value={UNKNOWN_MARK} showSerializedText={false} />);

        await enterViewport();

        expect(await screen.findByTestId(RTE_HTML_TEST_ID)).toHaveTextContent('Lossy text');
    });

    it('should stop warning before the page is left once editing ends', async () => {
        const { rerender } = render(<RichTextEditor isEditing value={PARAGRAPH} />);
        await enterViewport();
        const editable = await findEditable();
        await typeInto(editable, 'Hello world');
        const whileEditing = new Event('beforeunload', { cancelable: true });

        window.dispatchEvent(whileEditing);

        expect(whileEditing.defaultPrevented).toBe(true);

        rerender(<RichTextEditor isEditing={false} value={PARAGRAPH} />);
        const afterEditing = new Event('beforeunload', { cancelable: true });
        window.dispatchEvent(afterEditing);

        expect(afterEditing.defaultPrevented).toBe(false);
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
