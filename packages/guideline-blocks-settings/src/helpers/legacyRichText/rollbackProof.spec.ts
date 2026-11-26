/* (c) Copyright Frontify Ltd., all rights reserved. */

import {
    BoldPlugin,
    EmojiPlugin,
    ItalicPlugin,
    LinkPlugin,
    MentionableCategory,
    MentionPlugin,
    PaddingSizes,
    ParagraphPlugin,
    PluginComposer,
    Position,
    RichTextEditor,
    type RichTextEditorProps,
    serializeRawToHtmlAsync,
    TextStylePlugin,
    UnorderedListPlugin,
} from '@frontify/fondue/rte';
import { act, render, waitFor } from '@testing-library/react';
import { createElement } from 'react';
import { describe, expect, it, type Mock, vi } from 'vitest';

import { convertLegacyRichText } from './convertLegacyRichText';
import { isLegacyText } from './legacyNode';
import { toLegacyRichText } from './toLegacyRichText';
import {
    type ConvertLegacyRichTextResult,
    type LegacyElement,
    type LegacyNode,
    type LegacyRichTextTree,
    type LegacyText,
    type ResolveMention,
    type ToLegacyRichTextResult,
} from './types';
import { LINE_BREAK } from './vocabulary';

type Mentionable = { id: string; name: string };

type RollbackFixture = { id: string; tree: LegacyRichTextTree };

type ObservedFixture = RollbackFixture & {
    convertOutcome: ConvertLegacyRichTextResult['outcome'];
    toLegacyOutcome: ToLegacyRichTextResult['outcome'];
};

type ValueChanged = NonNullable<RichTextEditorProps['onValueChanged']>;

type MentionedUsersFixture = { fixtureId: string; userIds: string[] };

const ADA: Mentionable = { id: 'user-1', name: 'Ada Lovelace' };
const GRACE: Mentionable = { id: 'user-2', name: 'Grace Hopper' };
const DESIGN_TEAM: Mentionable = { id: 'group-1', name: 'Design Team' };
const USERS = [ADA, GRACE];
const MENTIONABLES = [...USERS, DESIGN_TEAM];

const BODY_TEXT_STYLE = 'p';
const LEFT_ALIGN = 'left';
const MENTION_TYPE = 'mention';
const DOCS_URL = 'https://example.com/docs';
const NEW_TAB_TARGET = '_blank';
const SAME_TAB_TARGET = '_self';
const COMMENT_FONT_SIZE = '13px';
const COMMENT_LINE_HEIGHT = '16px';
const PLAIN_TEXT_SEPARATOR = ' ';
const EDITOR_SETTLE_MS = 50;
const UNPADDED_MENTION_ID = 'unpadded-mention';

// The comment editor's plugin set, without the blur and focus behaviour that does not touch the value.
const createCommentPlugins = (): PluginComposer => {
    return new PluginComposer()
        .setPlugin([
            new MentionPlugin({
                mentionableItems: USERS.map((user) => ({
                    data: { id: user.id, category: MentionableCategory.USER },
                    key: user.id,
                    text: user.name,
                })),
            }),
        ])
        .setPlugin([new BoldPlugin(), new ItalicPlugin(), new UnorderedListPlugin({ isSoftBreak: true })])
        .setPlugin([new EmojiPlugin(), new LinkPlugin()])
        .setPlugin([
            new TextStylePlugin({
                showIn: [],
                textStyles: [
                    new ParagraphPlugin({ styles: { fontSize: COMMENT_FONT_SIZE, lineHeight: COMMENT_LINE_HEIGHT } }),
                ],
            }),
        ]);
};

const resolveFromDirectory: ResolveMention = (_kind, id) => {
    const mentionable = MENTIONABLES.find((candidate) => candidate.id === id);
    if (mentionable === undefined) {
        return { status: 'unknown' };
    }

    return { status: 'resolved', username: mentionable.name, name: mentionable.name };
};

const bodyText = (text: string): LegacyText => ({ text, textStyle: BODY_TEXT_STYLE });

const paragraph = (...children: LegacyNode[]): LegacyElement => ({ type: 'p', align: LEFT_ALIGN, children });

const mention = (mentionable: Mentionable, category: MentionableCategory): LegacyElement => ({
    id: mentionable.id,
    type: MENTION_TYPE,
    value: mentionable.name,
    category,
    children: [{ text: '' }],
});

const link = (target: string, label: string): LegacyElement => ({
    type: 'a',
    url: DOCS_URL,
    target,
    children: [bodyText(label)],
});

const bulletList = (...items: LegacyElement[]): LegacyElement => ({ type: 'ul', children: items });

const listItem = (...children: LegacyElement[]): LegacyElement => ({ type: 'li', children });

const listItemContent = (...children: LegacyNode[]): LegacyElement => ({ type: 'lic', children });

const textItem = (text: string, ...nested: LegacyElement[]): LegacyElement => {
    return listItem(listItemContent(bodyText(text)), ...nested);
};

const PLUGIN_FIXTURES: RollbackFixture[] = [
    {
        id: 'mention',
        tree: [paragraph(bodyText('Hi '), mention(ADA, MentionableCategory.USER), bodyText(', please check this'))],
    },
    {
        id: 'bold',
        tree: [
            paragraph(
                bodyText('Lorem '),
                { text: 'ipsum', textStyle: BODY_TEXT_STYLE, bold: true },
                bodyText(' dolor'),
            ),
        ],
    },
    {
        id: 'italic',
        tree: [
            paragraph(
                bodyText('Lorem '),
                { text: 'ipsum', textStyle: BODY_TEXT_STYLE, italic: true },
                bodyText(' dolor'),
            ),
        ],
    },
    { id: 'bullet-list', tree: [bulletList(textItem('First item'), textItem('Second item'))] },
    {
        id: 'nested-bullet-list',
        tree: [bulletList(textItem('Parent item', bulletList(textItem('Child item'))), textItem('Sibling item'))],
    },
    { id: 'emoji-character', tree: [paragraph(bodyText('Ship it 🎉 today 😀'))] },
    {
        id: 'link-new-tab',
        tree: [paragraph(bodyText('See '), link(NEW_TAB_TARGET, 'the docs'), bodyText(' first'))],
    },
    {
        id: 'link-same-tab',
        tree: [paragraph(bodyText('See '), link(SAME_TAB_TARGET, 'the docs'), bodyText(' first'))],
    },
    { id: 'body-text-style', tree: [paragraph(bodyText('Body text'))] },
    { id: 'soft-break', tree: [paragraph(bodyText('First line\nSecond line'))] },
    { id: 'empty-document', tree: [paragraph(bodyText(''))] },
    { id: 'multi-paragraph', tree: [paragraph(bodyText('First paragraph')), paragraph(bodyText('Second paragraph'))] },
];

const CENSUS_FIXTURES: RollbackFixture[] = [
    { id: 'census-paragraph', tree: [{ type: 'p', children: [{ text: 'Lorem ipsum' }] }] },
    { id: 'census-align-left', tree: [{ type: 'p', align: LEFT_ALIGN, children: [{ text: 'Lorem ipsum' }] }] },
    { id: 'census-text-style-body', tree: [{ type: 'p', children: [bodyText('Lorem ipsum')] }] },
    {
        id: 'census-mention',
        tree: [paragraph(bodyText(''), mention(ADA, MentionableCategory.USER), bodyText(' please review'))],
    },
    {
        id: 'census-mention-user',
        tree: [
            paragraph(
                bodyText('Thanks '),
                mention(ADA, MentionableCategory.USER),
                bodyText(' and '),
                mention(GRACE, MentionableCategory.USER),
                bodyText('!'),
            ),
        ],
    },
    {
        id: 'census-mention-other-category',
        tree: [paragraph(bodyText('Ping '), mention(DESIGN_TEAM, MentionableCategory.GROUP), bodyText(''))],
    },
    {
        id: 'census-several-top-level-blocks',
        tree: [paragraph(bodyText('Before the list')), bulletList(textItem('Item')), paragraph(bodyText('After'))],
    },
    {
        id: 'census-link',
        tree: [
            paragraph(bodyText('Read '), { type: 'a', url: DOCS_URL, children: [bodyText('this page')] }, bodyText('')),
        ],
    },
    {
        id: 'census-link-new-tab',
        tree: [paragraph(bodyText(''), link(NEW_TAB_TARGET, 'Docs'), bodyText(''))],
    },
    { id: 'census-bold', tree: [paragraph({ text: 'Important', textStyle: BODY_TEXT_STYLE, bold: true })] },
    { id: 'census-emoji-character', tree: [paragraph(bodyText('👍'))] },
    {
        id: 'census-list-item-content',
        tree: [
            bulletList(
                listItem(
                    listItemContent(bodyText('Ask '), mention(GRACE, MentionableCategory.USER), {
                        text: ' today',
                        textStyle: BODY_TEXT_STYLE,
                        bold: true,
                    }),
                ),
            ),
        ],
    },
    { id: 'census-soft-break', tree: [bulletList(textItem('Item line one\nItem line two'))] },
    { id: 'census-bullet-list', tree: [bulletList(textItem('One'), textItem('Two'), textItem('Three'))] },
    {
        id: 'census-italic',
        tree: [paragraph({ text: 'Emphasis', textStyle: BODY_TEXT_STYLE, italic: true, bold: true })],
    },
    {
        id: 'census-nested-list',
        tree: [bulletList(textItem('Level one', bulletList(textItem('Level two', bulletList(textItem('Three'))))))],
    },
    { id: 'census-empty-document', tree: [] },
];

const OFF_PLUGIN_FIXTURES: ObservedFixture[] = [
    {
        id: 'census-numbered-list',
        tree: [{ type: 'ol', children: [textItem('First'), textItem('Second')] }],
        convertOutcome: 'exact',
        toLegacyOutcome: 'exact',
    },
    {
        id: 'census-text-style-other',
        tree: [paragraph({ text: 'Pasted heading', textStyle: 'heading1' })],
        convertOutcome: 'requires-review',
        toLegacyOutcome: 'exact',
    },
    {
        id: 'census-unknown-element',
        tree: [{ type: 'blockquote', children: [bodyText('Pasted quote')] }],
        convertOutcome: 'requires-review',
        toLegacyOutcome: 'exact',
    },
    {
        id: 'census-strikethrough',
        tree: [paragraph({ text: 'Struck', textStyle: BODY_TEXT_STYLE, strikethrough: true })],
        convertOutcome: 'exact',
        toLegacyOutcome: 'exact',
    },
    {
        id: 'census-underline',
        tree: [paragraph({ text: 'Underlined', textStyle: BODY_TEXT_STYLE, underline: true })],
        convertOutcome: 'exact',
        toLegacyOutcome: 'exact',
    },
    {
        id: 'census-align-other',
        tree: [{ type: 'p', align: 'center', children: [bodyText('Centred')] }],
        convertOutcome: 'exact',
        toLegacyOutcome: 'exact',
    },
    {
        id: 'census-inline-code',
        tree: [paragraph(bodyText('Run '), { text: 'pnpm test', textStyle: BODY_TEXT_STYLE, code: true })],
        convertOutcome: 'exact',
        toLegacyOutcome: 'exact',
    },
];

// Convert merges these leaves, and the server joins leaves with a space, so its plain text loses one space.
const LEAF_SPLIT_FIXTURE: RollbackFixture = {
    id: 'leaves-differing-by-body-text-style',
    tree: [paragraph(bodyText('Lorem '), { text: 'ipsum' })],
};
const LEAF_SPLIT_ORIGINAL_PLAIN_TEXT = 'Lorem  ipsum';
const LEAF_SPLIT_ROLLBACK_PLAIN_TEXT = 'Lorem ipsum';

// Shapes whose leaf boundaries decide the spacing of the server's plain text.
const LEAF_BOUNDARY_FIXTURES: RollbackFixture[] = [
    {
        id: 'adjacent-mentions',
        tree: [
            paragraph(
                bodyText('Ping '),
                mention(ADA, MentionableCategory.USER),
                bodyText(''),
                mention(GRACE, MentionableCategory.USER),
                bodyText(''),
            ),
        ],
    },
    LEAF_SPLIT_FIXTURE,
];

const EXACT_FIXTURES = [...PLUGIN_FIXTURES, ...CENSUS_FIXTURES, ...LEAF_BOUNDARY_FIXTURES];
const WRITTEN_FIXTURES: RollbackFixture[] = [
    ...EXACT_FIXTURES,
    ...OFF_PLUGIN_FIXTURES.filter((fixture) => fixture.toLegacyOutcome === 'exact'),
];
// Replacing the editor content with an empty tree inserts nothing, so the editor reports no value.
const NON_EMPTY_WRITTEN_FIXTURES = WRITTEN_FIXTURES.filter((fixture) => fixture.tree.length > 0);

// Synthetic element types the comment editor might treat as inline; it keeps them without empty leaves around them.
const ELEMENT_TYPE_PROBE_FIXTURES: RollbackFixture[] = [
    {
        id: 'synthetic-emoji-element-type-probe',
        tree: [{ type: 'p', children: [{ type: 'emoji', value: 'x', children: [{ text: '' }] }] }],
    },
    {
        id: 'synthetic-link-element-type-probe',
        tree: [{ type: 'p', children: [{ type: 'link', url: '/a', children: [{ text: 'L' }] }] }],
    },
    {
        id: 'synthetic-button-element-type-probe',
        tree: [{ type: 'p', children: [{ type: 'button', url: '/a', children: [{ text: 'L' }] }] }],
    },
];
const SAME_LEAF_SPLIT_FIXTURES = WRITTEN_FIXTURES.filter((fixture) => fixture !== LEAF_SPLIT_FIXTURE);
const EMPTY_WRITTEN_FIXTURES = WRITTEN_FIXTURES.filter((fixture) => fixture.tree.length === 0);

// Positive control: a mention without Slate's empty leaves around it, which the editor pads.
const UNPADDED_MENTION_TREE: LegacyRichTextTree = [{ type: 'p', children: [mention(ADA, MentionableCategory.USER)] }];
const PADDED_MENTION_TREE: LegacyRichTextTree = [
    { type: 'p', children: [{ text: '' }, mention(ADA, MentionableCategory.USER), { text: '' }] },
];

const MENTIONED_USERS_FIXTURES: MentionedUsersFixture[] = [
    { fixtureId: 'mention', userIds: [ADA.id] },
    { fixtureId: 'census-mention', userIds: [ADA.id] },
    { fixtureId: 'census-mention-user', userIds: [ADA.id, GRACE.id] },
    { fixtureId: 'census-list-item-content', userIds: [GRACE.id] },
    { fixtureId: 'adjacent-mentions', userIds: [ADA.id, GRACE.id] },
];
const UNMENTIONED_USERS_FIXTURES = WRITTEN_FIXTURES.filter((fixture) => {
    return !MENTIONED_USERS_FIXTURES.some((mentioned) => mentioned.fixtureId === fixture.id);
});

const fixtureById = (id: string): RollbackFixture => {
    const fixture = WRITTEN_FIXTURES.find((candidate) => candidate.id === id);
    if (fixture === undefined) {
        throw new Error(`No fixture has the id ${id}`);
    }

    return fixture;
};

const convertStored = (tree: LegacyRichTextTree): ConvertLegacyRichTextResult => {
    return convertLegacyRichText(JSON.stringify(tree), { resolveMention: resolveFromDirectory });
};

const writeBack = (converted: ConvertLegacyRichTextResult): ToLegacyRichTextResult => {
    if (converted.document === null) {
        throw new Error(`An ${converted.outcome} conversion has no document to write back`);
    }

    return toLegacyRichText(converted.document);
};

const writtenTree = (tree: LegacyRichTextTree): LegacyRichTextTree => {
    const written = writeBack(convertStored(tree));
    if (written.outcome !== 'exact') {
        throw new Error('The converted document has no exact legacy tree');
    }

    return written.value;
};

// Mirrors the server, which notifies the users a comment mentions.
const extractMentionedUserIds = (tree: LegacyNode[]): unknown[] => {
    const ids: unknown[] = [];

    for (const node of tree) {
        if (isLegacyText(node)) {
            continue;
        }

        if (node.type === MENTION_TYPE && node.category === MentionableCategory.USER) {
            ids.push(node.id);
        }

        ids.push(...extractMentionedUserIds(node.children));
    }

    return ids;
};

const collectPlainTextParts = (tree: LegacyNode[]): string[] => {
    const parts: string[] = [];

    for (const node of tree) {
        if (isLegacyText(node)) {
            parts.push(node.text);
        } else if (node.type === MENTION_TYPE) {
            parts.push(`@${String(node.value)}`);
        } else {
            parts.push(...collectPlainTextParts(node.children));
        }
    }

    return parts;
};

// Mirrors the server, which writes the plain text of a comment into notifications.
const serializeToPlainText = (tree: LegacyNode[]): string => {
    return collectPlainTextParts(tree).join(PLAIN_TEXT_SEPARATOR).trim();
};

/** The lines of the text leaves outside mentions, which the display shows as written. */
const collectShownLines = (tree: LegacyNode[]): string[] => {
    const lines: string[] = [];

    for (const node of tree) {
        if (isLegacyText(node)) {
            lines.push(...node.text.split(LINE_BREAK).filter((line) => line !== ''));
        } else if (node.type !== MENTION_TYPE) {
            lines.push(...collectShownLines(node.children));
        }
    }

    return lines;
};

const renderCommentEditor = (id: string, tree: LegacyRichTextTree): Mock<ValueChanged> => {
    const onValueChanged = vi.fn<ValueChanged>();

    render(
        createElement(RichTextEditor, {
            id,
            value: JSON.stringify(tree),
            onValueChanged,
            plugins: createCommentPlugins(),
            padding: PaddingSizes.Small,
            position: Position.BOTTOM,
            updateValueOnChange: true,
        }),
    );

    return onValueChanged;
};

const expectSettledValue = async (onValueChanged: Mock<ValueChanged>, expected: LegacyRichTextTree): Promise<void> => {
    await waitFor(() => {
        expect(onValueChanged).toHaveBeenLastCalledWith(expected);
    });
    const settledCallCount = onValueChanged.mock.calls.length;

    await act(() => new Promise((resolve) => setTimeout(resolve, EDITOR_SETTLE_MS)));

    expect(onValueChanged).toHaveBeenCalledTimes(settledCallCount);
};

describe('rollback of comments to the legacy editor', () => {
    it.each(EXACT_FIXTURES)('should write $id back to an exact legacy tree (a) (FP-1060 rollback)', ({ tree }) => {
        const converted = convertStored(tree);

        expect(converted.outcome).toBe('exact');
        expect(writeBack(converted).outcome).toBe('exact');
    });

    it.each(OFF_PLUGIN_FIXTURES)(
        'should convert $id as $convertOutcome and write it back as $toLegacyOutcome (a) (FP-1060 rollback)',
        ({ tree, convertOutcome, toLegacyOutcome }) => {
            const converted = convertStored(tree);

            expect(converted.outcome).toBe(convertOutcome);
            expect(writeBack(converted).outcome).toBe(toLegacyOutcome);
        },
    );

    it.each(NON_EMPTY_WRITTEN_FIXTURES)(
        'should show $id in the legacy display as the original does (b) (FP-1060 rollback)',
        async ({ tree }) => {
            const originalHtml = await serializeRawToHtmlAsync(JSON.stringify(tree), createCommentPlugins());
            const writtenHtml = await serializeRawToHtmlAsync(
                JSON.stringify(writtenTree(tree)),
                createCommentPlugins(),
            );

            expect(writtenHtml).not.toBe('');
            expect(writtenHtml).toBe(originalHtml);
            for (const line of collectShownLines(tree)) {
                expect(writtenHtml).toContain(line);
            }
        },
    );

    it.each(EMPTY_WRITTEN_FIXTURES)(
        'should show $id in the legacy display as nothing, as the original does (b) (FP-1060 rollback)',
        async ({ tree }) => {
            const originalHtml = await serializeRawToHtmlAsync(JSON.stringify(tree), createCommentPlugins());
            const writtenHtml = await serializeRawToHtmlAsync(
                JSON.stringify(writtenTree(tree)),
                createCommentPlugins(),
            );

            expect(originalHtml).toBe('');
            expect(writtenHtml).toBe(originalHtml);
        },
    );

    it('should report the padded tree for a mention without empty leaves in the legacy comment editor (c) (FP-1060 rollback)', async () => {
        const onValueChanged = renderCommentEditor(UNPADDED_MENTION_ID, UNPADDED_MENTION_TREE);

        await expectSettledValue(onValueChanged, PADDED_MENTION_TREE);
    });

    it.each(NON_EMPTY_WRITTEN_FIXTURES)(
        'should normalize $id in the legacy comment editor to the written tree (c) (FP-1060 rollback)',
        async ({ id, tree }) => {
            const written = writtenTree(tree);
            const onValueChanged = renderCommentEditor(id, written);

            await expectSettledValue(onValueChanged, written);
        },
    );

    it.each(ELEMENT_TYPE_PROBE_FIXTURES)(
        'should keep the $id without empty leaves around it in the legacy comment editor (c) (FP-1060 rollback)',
        async ({ id, tree }) => {
            const onValueChanged = renderCommentEditor(id, tree);

            await expectSettledValue(onValueChanged, tree);
        },
    );

    it.each(MENTIONED_USERS_FIXTURES)(
        'should keep the mentioned user ids $userIds of $fixtureId (d) (FP-1060 rollback)',
        ({ fixtureId, userIds }) => {
            const { tree } = fixtureById(fixtureId);

            expect(extractMentionedUserIds(tree)).toEqual(userIds);
            expect(extractMentionedUserIds(writtenTree(tree))).toEqual(userIds);
        },
    );

    it.each(UNMENTIONED_USERS_FIXTURES)(
        'should keep the mentioned user ids of $id (d) (FP-1060 rollback)',
        ({ tree }) => {
            expect(extractMentionedUserIds(writtenTree(tree))).toEqual(extractMentionedUserIds(tree));
        },
    );

    it.each(SAME_LEAF_SPLIT_FIXTURES)('should keep the plain text of $id (d) (FP-1060 rollback)', ({ tree }) => {
        expect(serializeToPlainText(writtenTree(tree))).toEqual(serializeToPlainText(tree));
    });

    it('should join leaves with a space at their boundaries on the server and give the display text after rollback (d) (FP-1060 rollback)', async () => {
        const { tree } = LEAF_SPLIT_FIXTURE;
        const written = writtenTree(tree);
        const originalHtml = await serializeRawToHtmlAsync(JSON.stringify(tree), createCommentPlugins());
        const writtenHtml = await serializeRawToHtmlAsync(JSON.stringify(written), createCommentPlugins());

        expect(serializeToPlainText(tree)).toBe(LEAF_SPLIT_ORIGINAL_PLAIN_TEXT);
        expect(serializeToPlainText(written)).toBe(LEAF_SPLIT_ROLLBACK_PLAIN_TEXT);
        expect(writtenHtml).toBe(originalHtml);
        expect(writtenHtml).toContain(LEAF_SPLIT_ROLLBACK_PLAIN_TEXT);
    });
});
