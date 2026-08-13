/* (c) Copyright Frontify Ltd., all rights reserved. */

import { getAppBridgeBlockStub } from '@frontify/app-bridge';
import { PluginComposer } from '@frontify/fondue/rte';
import { act, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { convertToRteValue } from '../../helpers';

import { BreakAfterPlugin, RichTextEditor, TextStyles, getDefaultPluginsWithLinkChooser } from '.';

const RTE_HTML_TEST_ID = 'rte-content-html';
const RICH_TEXT_EDITOR_TEST_ID = 'rich-text-editor';
const RICH_TEXT_CONTAINER_TEST_ID = 'rich-text-editor-container';

const appBridge = getAppBridgeBlockStub({ blockId: 1 });

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

    it('should render a rich text editor in edit mode', async () => {
        render(<RichTextEditor isEditing plugins={getDefaultPluginsWithLinkChooser(appBridge)} />);

        await enterViewport();

        expect(await screen.findByTestId(RICH_TEXT_EDITOR_TEST_ID)).toBeInTheDocument();
    });

    it('should only render a rich text editor once it has entered the viewport while editing', async () => {
        render(
            <RichTextEditor
                isEditing
                value={convertToRteValue('p', 'Hello there!')}
                plugins={getDefaultPluginsWithLinkChooser(appBridge)}
            />,
        );

        expect(await screen.findByTestId(RTE_HTML_TEST_ID)).toBeInTheDocument();
        expect(screen.queryByTestId(RICH_TEXT_EDITOR_TEST_ID)).not.toBeInTheDocument();

        await enterViewport();

        expect(await screen.findByTestId(RICH_TEXT_EDITOR_TEST_ID)).toBeInTheDocument();
        expect(screen.queryByTestId(RTE_HTML_TEST_ID)).not.toBeInTheDocument();
    });

    it('should render a rich text html in view mode', async () => {
        render(<RichTextEditor isEditing={false} value="test" />);

        expect(await screen.findByTestId(RTE_HTML_TEST_ID)).toBeInTheDocument();
    });

    it('should render a json value in view mode', async () => {
        render(<RichTextEditor isEditing={false} value={convertToRteValue(TextStyles.heading1, 'Test Heading')} />);

        expect(await screen.findByTestId(RTE_HTML_TEST_ID)).toBeInTheDocument();
        expect(screen.getByTestId(RTE_HTML_TEST_ID)).toHaveTextContent('Test Heading');
    });

    it('should render a html value in view mode', async () => {
        render(<RichTextEditor isEditing={false} value="<p>Test Paragraph</p>" />);

        expect(await screen.findByTestId(RTE_HTML_TEST_ID)).toBeInTheDocument();
        expect(screen.getByTestId(RTE_HTML_TEST_ID)).toHaveTextContent('Test Paragraph');
    });

    it('should not render html output if the value is empty', async () => {
        render(<RichTextEditor isEditing={false} value="" />);

        await waitFor(() => {
            expect(screen.queryByTestId(RTE_HTML_TEST_ID)).not.toBeInTheDocument();
        });
    });

    it('should not render html output if the value is undefined', async () => {
        render(<RichTextEditor isEditing={false} />);

        await waitFor(() => {
            expect(screen.queryByTestId(RTE_HTML_TEST_ID)).not.toBeInTheDocument();
        });
    });

    // TODO(vitest-migration): the link/button insertion tests could not be migrated. They all drive
    // the Plate `contenteditable` (select all -> floating toolbar -> link modal), and under happy-dom
    // neither half works: typing never reaches the document because `beforeinput` /
    // `InputEvent.getTargetRanges()` are unimplemented, and the floating toolbar never mounts even
    // with a valid DOM selection because it is positioned from real layout rects. On top of that,
    // `react-hotkeys-hook` (used inside the fondue RTE) throws on every keydown that reaches
    // `document`. Dropped:
    //   - should be able to select internal link
    //   - should be able to select internal link with target blank
    //   - should be able to select internal button link
    //   - should create a link with a link typed in the RTE
    //   - should not create a link with a : after a word
    //   - should prepend the URL with https:// if not exists
    //   - should allow URLs that start with /document/ (present twice in the Cypress spec)
    //   - should not add https:// to the URL for mailto: links
    // The URL normalisation rules the last three covered are already unit-tested in
    // `src/helpers/addHttps.spec.ts` and `src/components/Link/utils/relativeUrlRegex.spec.ts`; what
    // is left uncovered is the plugin-to-LinkSelector wiring and the typing autoformat.

    it('should render responsive columns in edit mode', async () => {
        render(
            <RichTextEditor
                isEditing
                plugins={new PluginComposer().setPlugin([new BreakAfterPlugin({ columns: 4, gap: 30 })])}
                value={convertToRteValue('p', 'Hello there!')}
            />,
        );

        await enterViewport();

        const richTextEditor = await screen.findByTestId(RICH_TEXT_EDITOR_TEST_ID);
        const editable = richTextEditor.querySelector('[contenteditable]');

        expect(screen.getByTestId(RICH_TEXT_CONTAINER_TEST_ID)).toHaveClass('tw-@container');
        expect(editable).toHaveClass('tw-columns-1', '@md:!tw-columns-4');
        expect(editable).toHaveStyle({ columnGap: '30px' });
    });

    it('should render responsive columns in view mode', async () => {
        render(
            <RichTextEditor
                isEditing={false}
                columns={4}
                gap="30px"
                plugins={new PluginComposer().setPlugin([new BreakAfterPlugin({ columns: 2, gap: 30 })])}
                value={convertToRteValue('p', 'Hello there!')}
            />,
        );

        const rteHtml = await screen.findByTestId(RTE_HTML_TEST_ID);
        const serialized = rteHtml.firstElementChild;

        expect(screen.getByTestId(RICH_TEXT_CONTAINER_TEST_ID)).toHaveClass('tw-@container');
        expect(serialized).toHaveClass('tw-columns-1', '@md:!tw-columns-4');
        expect(serialized).toHaveStyle({ columnGap: '30px' });
    });
});
