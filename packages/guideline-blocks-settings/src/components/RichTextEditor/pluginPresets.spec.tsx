/* (c) Copyright Frontify Ltd., all rights reserved. */

import { getAppBridgeBlockStub } from '@frontify/app-bridge/testing';
import { type RtePlugin } from '@frontify/fondue/rich-text-editor';
import { act, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getDefaultPluginsWithLinkChooser, getTitlePlugins } from './pluginPresets';
import { RichTextEditor } from './RichTextEditor';
import { readRichTextValue } from './richTextValue';
import { TextStylePluginsWithoutImage } from './textStylePlugins';

const RICH_TEXT_EDITOR_TEST_ID = 'rich-text-editor';
const EDITABLE_SELECTOR = '[contenteditable="true"]';

const stringify = (tree: unknown[]): string => JSON.stringify(tree);

const MARKED_HEADING = stringify([
    {
        type: 'heading1',
        align: 'center',
        children: [
            { text: 'Bold', bold: true },
            { text: 'Italic', italic: true },
            { text: 'Underline', underline: true },
            { text: 'Strikethrough', strikethrough: true },
        ],
    },
]);
const LINKED_PARAGRAPH = stringify([
    {
        type: 'p',
        children: [
            { text: 'Read ' },
            { type: 'a', url: 'https://example.com/docs', target: '_blank', children: [{ text: 'docs' }] },
            { text: '' },
        ],
    },
]);
const FULL_VALUE = stringify([
    { type: 'heading1', align: 'center', children: [{ text: 'Title', bold: true }] },
    {
        type: 'p',
        children: [
            { text: 'Italic', italic: true },
            { text: 'Underline', underline: true },
            { text: 'Strikethrough', strikethrough: true },
            { text: 'Code', code: true },
            { type: 'a', url: 'https://example.com/docs', target: '_blank', children: [{ text: 'docs' }] },
            {
                type: 'button',
                url: 'https://example.com/start',
                target: '_self',
                buttonStyle: 'primary',
                children: [{ text: 'start' }],
            },
            { text: '' },
        ],
    },
    {
        type: 'ul',
        children: [{ type: 'li', children: [{ type: 'lic', children: [{ text: 'Bullet' }] }] }],
    },
    {
        type: 'ol',
        children: [{ type: 'li', children: [{ type: 'lic', children: [{ text: 'Numbered' }] }] }],
    },
    { type: 'checkbox-item', checked: true, children: [{ text: 'Checked' }] },
]);

const PRESETS: [string, () => readonly RtePlugin[]][] = [
    ['getDefaultPluginsWithLinkChooser', () => getDefaultPluginsWithLinkChooser(getAppBridgeBlockStub())],
    ['getTitlePlugins', () => getTitlePlugins()],
    ['getTitlePlugins without the image styles', () => getTitlePlugins(TextStylePluginsWithoutImage)],
];

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

describe('plugin presets', () => {
    beforeEach(() => {
        IntersectionObserverStub.instances = [];
        vi.stubGlobal('IntersectionObserver', IntersectionObserverStub);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it.each(PRESETS)('should give %s plugins with unique ids', (_name, createPlugins) => {
        const ids = createPlugins().map(({ id }) => id);

        expect(new Set(ids).size).toBe(ids.length);
    });

    it.each(PRESETS)('should mount the editor with %s', async (_name, createPlugins) => {
        render(<RichTextEditor isEditing plugins={createPlugins()} />);

        await enterViewport();

        const editor = await screen.findByTestId(RICH_TEXT_EDITOR_TEST_ID);
        await waitFor(() => {
            expect(editor.querySelector(EDITABLE_SELECTOR)).toBeInTheDocument();
        });
    });

    it('should keep a value with every default style editable with getDefaultPluginsWithLinkChooser', () => {
        const stored = readRichTextValue(FULL_VALUE, getDefaultPluginsWithLinkChooser(getAppBridgeBlockStub()));

        expect(stored.access).toBe('editable');
    });

    it('should keep a heading with marks and alignment editable with getTitlePlugins', () => {
        const stored = readRichTextValue(MARKED_HEADING, getTitlePlugins());

        expect(stored.access).toBe('editable');
    });

    it('should show a value with a link read only with getTitlePlugins', () => {
        const stored = readRichTextValue(LINKED_PARAGRAPH, getTitlePlugins());

        expect(stored.access).toBe('readonly');
    });
});
