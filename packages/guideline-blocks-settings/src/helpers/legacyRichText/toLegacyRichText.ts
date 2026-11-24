/* (c) Copyright Frontify Ltd., all rights reserved. */

import { writeAlignment } from './alignment';
import { toLegacyColor } from './color';
import { copyValue, setOwn } from './copyValue';
import { readButtonAppearance, writeTarget } from './link';
import {
    type LegacyElement,
    type LegacyNode,
    type LegacyRichTextDiagnostic,
    type LegacyRichTextNotReversibleCode,
    type LegacyRichTextPath,
    type LegacyRichTextTree,
    type LegacyText,
    type LinkAppearance,
    type OpenRichTextDocument,
    type ToLegacyRichTextOptions,
    type ToLegacyRichTextResult,
} from './types';
import { TEXT_MARK_KEYS, isTextStyleName } from './vocabulary';

type StoredNode = { [property: string]: unknown };
type ColumnBreakValue = 'active' | 'inactive';
type PropertyEntry = { key: string; value: unknown };
type NotReversibleDiagnostic = LegacyRichTextDiagnostic<LegacyRichTextNotReversibleCode>;

type ToLegacyContext = { diagnostics: NotReversibleDiagnostic[]; columns: number; columnBreaks: number };
type BlockOptions = {
    path: LegacyRichTextPath;
    breakAfterColumn: ColumnBreakValue | undefined;
    context: ToLegacyContext;
};
type NestedOptions = { path: LegacyRichTextPath; context: ToLegacyContext };
type TextBlockSpec = { legacyType: string; declaredKeys: readonly string[] };
type ListSpec = TextBlockSpec & { isNumbered: boolean };
type CheckItemOptions = NestedOptions & { level: number; writes: CheckItemWrite[] };

type LinkReading = { href: string; openInNewTab: boolean; appearance: LinkAppearance | undefined };
type TextItem = { kind: 'text'; text: string; marks: PropertyEntry[]; link: LinkReading | undefined };
type NodeItem = { kind: 'node'; node: LegacyNode };
type InlineItem = TextItem | NodeItem;
type CheckItemWrite = {
    level: number;
    align: PropertyEntry[];
    checked: boolean;
    undeclared: PropertyEntry[];
    children: LegacyNode[];
};

const DEFAULT_COLUMNS = 1;
const DOCUMENT_KEYS = ['version', 'blocks'];
const MAX_NESTING_DEPTH = 128;

const PARAGRAPH_KEYS = ['type', 'children', 'align'];
const TEXT_STYLE_KEYS = [...PARAGRAPH_KEYS, 'style'];
const BULLET_LIST_KEYS = ['type', 'children'];
const NUMBERED_LIST_KEYS = [...BULLET_LIST_KEYS, 'start'];
const LIST_ITEM_KEYS = ['type', 'children'];
const CHECK_LIST_KEYS = ['type', 'children'];
const CHECK_ITEM_KEYS = ['type', 'children', 'checked'];
const COLUMN_BREAK_KEYS = ['type'];
const BREAK_KEYS = ['type'];
const MENTION_KEYS = ['type', 'id', 'username', 'name', 'kind'];
const LINK_VALUE_KEYS = ['href', 'openInNewTab', 'appearance'];
const LEAF_KEYS = ['text', 'type', ...TEXT_MARK_KEYS, 'fontColor', 'link'];

const NEW_FORMAT_BLOCK_TYPES = [
    'paragraph',
    'textStyle',
    'quote',
    'bulletList',
    'numberedList',
    'listItem',
    'checkList',
    'checkItem',
    'columnBreak',
    'table',
    'tableRow',
    'tableCell',
    'tableHeader',
];

const PARAGRAPH_SPEC: TextBlockSpec = { legacyType: 'p', declaredKeys: PARAGRAPH_KEYS };
const QUOTE_SPEC: TextBlockSpec = { legacyType: 'quote', declaredKeys: PARAGRAPH_KEYS };
const LIST_ITEM_PARAGRAPH_SPEC: TextBlockSpec = { legacyType: 'lic', declaredKeys: PARAGRAPH_KEYS };
const BULLET_LIST_SPEC: ListSpec = { legacyType: 'ul', declaredKeys: BULLET_LIST_KEYS, isNumbered: false };
const NUMBERED_LIST_SPEC: ListSpec = { legacyType: 'ol', declaredKeys: NUMBERED_LIST_KEYS, isNumbered: true };

const LINE_BREAK = '\n';
const LINK_TYPE = 'a';
const BUTTON_TYPE = 'button';
const MENTION_TYPE = 'mention';
const CHECKBOX_ITEM_TYPE = 'checkbox-item';
const MIN_INDENT = 1;
const ACTIVE_COLUMN_BREAK: ColumnBreakValue = 'active';
const INACTIVE_COLUMN_BREAK: ColumnBreakValue = 'inactive';
const CHECK_ITEM_PARAGRAPH_INDEX = 0;
const CHECK_ITEM_NESTED_LIST_INDEX = 1;

const report = (context: ToLegacyContext, path: LegacyRichTextPath): void => {
    context.diagnostics.push({ code: 'no-legacy-form', path });
};

const isStoredNode = (value: unknown): value is StoredNode => {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const readNodeList = (value: unknown): StoredNode[] | null => {
    if (!Array.isArray(value)) {
        return null;
    }

    const nodes: StoredNode[] = [];
    for (const item of value) {
        if (!isStoredNode(item)) {
            return null;
        }

        nodes.push(item);
    }

    return nodes;
};

const readUndeclaredEntries = (node: StoredNode, declaredKeys: readonly string[]): PropertyEntry[] => {
    const entries: PropertyEntry[] = [];

    for (const key of Object.keys(node)) {
        if (!declaredKeys.includes(key)) {
            entries.push({ key, value: copyValue(node[key]) });
        }
    }

    return entries;
};

const readAlignEntries = (node: StoredNode): PropertyEntry[] => {
    if (node.align === undefined) {
        return [];
    }

    return [{ key: 'align', value: writeAlignment(node.align) }];
};

const readBreakEntries = (breakAfterColumn: ColumnBreakValue | undefined): PropertyEntry[] => {
    if (breakAfterColumn === undefined) {
        return [];
    }

    return [{ key: 'breakAfterColumn', value: breakAfterColumn }];
};

const createLegacyElement = (
    type: string,
    declared: PropertyEntry[],
    undeclared: PropertyEntry[],
    children: LegacyNode[],
): LegacyElement => {
    const element: LegacyElement = { type, children: [] };

    for (const entry of [...declared, ...undeclared]) {
        setOwn(element, entry.key, entry.value);
    }

    // children is added again so it is the last key of the written node.
    Reflect.deleteProperty(element, 'children');
    element.children = children;

    return element;
};

const createLeaf = (item: TextItem): LegacyText => {
    const leaf: LegacyText = { text: item.text };

    for (const mark of item.marks) {
        setOwn(leaf, mark.key, copyValue(mark.value));
    }

    return leaf;
};

const writeWhole = (node: StoredNode, path: LegacyRichTextPath, context: ToLegacyContext): LegacyElement | null => {
    const { type, children } = node;
    if (typeof type !== 'string' || !Array.isArray(children)) {
        report(context, path);

        return null;
    }

    const element: LegacyElement = { type, children: [] };

    // children is removed so it takes the position it has in the stored node.
    Reflect.deleteProperty(element, 'children');
    for (const key of Object.keys(node)) {
        setOwn(element, key, copyValue(node[key]));
    }

    return element;
};

const readLinkReading = (value: unknown): LinkReading | null => {
    if (!isStoredNode(value) || Object.keys(value).some((key) => !LINK_VALUE_KEYS.includes(key))) {
        return null;
    }

    const { href, openInNewTab, appearance } = value;
    if (typeof href !== 'string' || (openInNewTab !== undefined && openInNewTab !== true)) {
        return null;
    }

    if (appearance === undefined) {
        return { href, openInNewTab: openInNewTab === true, appearance: undefined };
    }

    const buttonAppearance = readButtonAppearance(appearance);
    if (buttonAppearance === undefined) {
        return null;
    }

    return { href, openInNewTab: openInNewTab === true, appearance: buttonAppearance };
};

const readMarkEntries = (leaf: StoredNode): PropertyEntry[] | null => {
    const entries: PropertyEntry[] = [];

    for (const key of TEXT_MARK_KEYS) {
        const value = leaf[key];
        if (value === undefined) {
            continue;
        }

        if (value !== true) {
            return null;
        }

        entries.push({ key, value: true });
    }

    if (leaf.subscript === true && leaf.superscript === true) {
        return null;
    }

    const { fontColor } = leaf;
    if (fontColor !== undefined) {
        if (!isStoredNode(fontColor) || typeof fontColor.color !== 'string') {
            return null;
        }

        const color = toLegacyColor(fontColor.color);
        if (color === null) {
            return null;
        }

        entries.push({ key: 'color', value: color });
    }

    return [...entries, ...readUndeclaredEntries(leaf, LEAF_KEYS)];
};

const readTextItem = (leaf: StoredNode, path: LegacyRichTextPath, context: ToLegacyContext): TextItem | null => {
    const { text } = leaf;
    const marks = readMarkEntries(leaf);
    if (typeof text !== 'string' || marks === null) {
        report(context, path);

        return null;
    }

    let link: LinkReading | undefined;
    if (leaf.link !== undefined) {
        const reading = readLinkReading(leaf.link);
        if (reading === null) {
            report(context, path);

            return null;
        }

        link = reading;
    }

    return { kind: 'text', text, marks, link };
};

const writeMentionCategory = (kind: unknown): string | undefined => {
    switch (kind) {
        case undefined:
            return 'user';
        case 'user':
        case 'group':
        case 'all':
            return kind;
        default:
            // The kind is an arbitrary stored value, not a union: anything else has no legacy category.
            return undefined;
    }
};

const hasMentionShape = (mention: StoredNode): boolean => {
    return typeof mention.id === 'string' && typeof mention.username === 'string' && typeof mention.name === 'string';
};

const readMentionItem = (mention: StoredNode, path: LegacyRichTextPath, context: ToLegacyContext): NodeItem | null => {
    if (!hasMentionShape(mention)) {
        const whole = writeWhole(mention, path, context);
        if (whole === null) {
            return null;
        }

        return { kind: 'node', node: whole };
    }

    const category = writeMentionCategory(mention.kind);
    if (category === undefined || readUndeclaredEntries(mention, MENTION_KEYS).length > 0) {
        report(context, path);

        return null;
    }

    const node = createLegacyElement(
        MENTION_TYPE,
        [
            { key: 'category', value: category },
            { key: 'id', value: mention.id },
        ],
        [],
        [{ text: '' }],
    );

    return { kind: 'node', node };
};

const appendBreak = (items: InlineItem[]): void => {
    const previous: InlineItem | undefined = items[items.length - 1];
    if (previous !== undefined && previous.kind === 'text') {
        previous.text += LINE_BREAK;

        return;
    }

    items.push({ kind: 'text', text: LINE_BREAK, marks: [], link: undefined });
};

const readInlineItems = (children: StoredNode[], options: NestedOptions): InlineItem[] | null => {
    const { path, context } = options;
    const items: InlineItem[] = [];
    let failed = false;

    for (let index = 0; index < children.length; index++) {
        const child = children[index];
        const childPath = [...path, index];
        const { type } = child;

        if (type === undefined) {
            const item = readTextItem(child, childPath, context);
            if (item === null) {
                failed = true;
            } else {
                items.push(item);
            }

            continue;
        }

        if (type === 'break') {
            if (readUndeclaredEntries(child, BREAK_KEYS).length > 0) {
                report(context, childPath);
                failed = true;
            } else {
                appendBreak(items);
            }

            continue;
        }

        if (type === 'mention') {
            const item = readMentionItem(child, childPath, context);
            if (item === null) {
                failed = true;
            } else {
                items.push(item);
            }

            continue;
        }

        const whole = writeUnknownInline(child, childPath, context);
        if (whole === null) {
            failed = true;
        } else {
            items.push({ kind: 'node', node: whole });
        }
    }

    if (failed) {
        return null;
    }

    return items;
};

const writeUnknownInline = (
    node: StoredNode,
    path: LegacyRichTextPath,
    context: ToLegacyContext,
): LegacyElement | null => {
    if (typeof node.type === 'string' && NEW_FORMAT_BLOCK_TYPES.includes(node.type)) {
        report(context, path);

        return null;
    }

    return writeWhole(node, path, context);
};

const haveSameFormatting = (first: TextItem, second: TextItem): boolean => {
    return JSON.stringify([first.marks, first.link]) === JSON.stringify([second.marks, second.link]);
};

const mergeAdjacentText = (items: InlineItem[]): InlineItem[] => {
    const merged: InlineItem[] = [];

    for (const item of items) {
        const previous: InlineItem | undefined = merged[merged.length - 1];
        if (
            previous !== undefined &&
            previous.kind === 'text' &&
            item.kind === 'text' &&
            haveSameFormatting(previous, item)
        ) {
            previous.text += item.text;
            continue;
        }

        merged.push(item);
    }

    return merged;
};

const isEmptyText = (item: InlineItem): boolean => {
    return item.kind === 'text' && item.text === '';
};

const createLink = (link: LinkReading, run: TextItem[]): LegacyElement => {
    const declared: PropertyEntry[] = [
        { key: 'url', value: link.href },
        { key: 'target', value: writeTarget(link.openInNewTab) },
    ];
    let type = LINK_TYPE;

    if (link.appearance !== undefined) {
        type = BUTTON_TYPE;
        declared.push({ key: 'buttonStyle', value: link.appearance });
    }

    return createLegacyElement(
        type,
        declared,
        [],
        run.map((item) => createLeaf(item)),
    );
};

const isInSameLink = (link: LinkReading, item: InlineItem): item is TextItem => {
    return item.kind === 'text' && item.link !== undefined && JSON.stringify(item.link) === JSON.stringify(link);
};

const wrapLinks = (items: InlineItem[]): LegacyNode[] => {
    const nodes: LegacyNode[] = [];
    let index = 0;

    while (index < items.length) {
        const item = items[index];

        if (item.kind === 'node') {
            nodes.push(item.node);
            index += 1;
            continue;
        }

        if (item.link === undefined) {
            nodes.push(createLeaf(item));
            index += 1;
            continue;
        }

        const run: TextItem[] = [item];
        let end = index + 1;
        while (end < items.length) {
            const candidate = items[end];
            if (!isInSameLink(item.link, candidate)) {
                break;
            }

            run.push(candidate);
            end += 1;
        }

        nodes.push(createLink(item.link, run));
        index = end;
    }

    return nodes;
};

const mapInline = (block: StoredNode, options: NestedOptions): LegacyNode[] | null => {
    const children = readNodeList(block.children);
    if (children === null) {
        report(options.context, options.path);

        return null;
    }

    const items = readInlineItems(children, options);
    if (items === null) {
        return null;
    }

    const nodes = wrapLinks(mergeAdjacentText(items).filter((item) => !isEmptyText(item)));
    if (nodes.length === 0) {
        return [{ text: '' }];
    }

    return nodes;
};

const mapTextBlock = (block: StoredNode, spec: TextBlockSpec, options: BlockOptions): LegacyElement[] => {
    const { path, breakAfterColumn, context } = options;
    const children = mapInline(block, { path, context });
    if (children === null) {
        return [];
    }

    const declared = [...readAlignEntries(block), ...readBreakEntries(breakAfterColumn)];
    const undeclared = readUndeclaredEntries(block, spec.declaredKeys);

    return [createLegacyElement(spec.legacyType, declared, undeclared, children)];
};

const mapTextStyleBlock = (block: StoredNode, options: BlockOptions): LegacyElement[] => {
    const { style } = block;
    if (typeof style !== 'string' || !isTextStyleName(style)) {
        report(options.context, options.path);

        return [];
    }

    return mapTextBlock(block, { legacyType: style, declaredKeys: TEXT_STYLE_KEYS }, options);
};

const isTooDeep = (path: LegacyRichTextPath, context: ToLegacyContext): boolean => {
    if (path.length <= MAX_NESTING_DEPTH) {
        return false;
    }

    report(context, path);

    return true;
};

const mapListItem = (item: StoredNode, options: NestedOptions): LegacyElement[] => {
    const { path, context } = options;
    if (isTooDeep(path, context)) {
        return [];
    }

    const children = readNodeList(item.children);
    if (children === null || children.length === 0) {
        report(context, path);

        return [];
    }

    const nodes: LegacyNode[] = [];
    for (let index = 0; index < children.length; index++) {
        const child = children[index];
        const childOptions: BlockOptions = { path: [...path, index], breakAfterColumn: undefined, context };

        for (const node of mapListItemChild(child, childOptions)) {
            nodes.push(node);
        }
    }

    return [createLegacyElement('li', [], readUndeclaredEntries(item, LIST_ITEM_KEYS), nodes)];
};

const mapListItemChild = (child: StoredNode, options: BlockOptions): LegacyElement[] => {
    switch (child.type) {
        case 'paragraph':
            return mapTextBlock(child, LIST_ITEM_PARAGRAPH_SPEC, options);
        case 'bulletList':
            return mapList(child, BULLET_LIST_SPEC, options);
        case 'numberedList':
            return mapList(child, NUMBERED_LIST_SPEC, options);
        default:
            // The block type is an arbitrary stored value, not a union: any other type is unknown content.
            return mapUnknownBlock(child, options);
    }
};

const mapUnknownBlock = (block: StoredNode, options: BlockOptions): LegacyElement[] => {
    const { path, breakAfterColumn, context } = options;
    if (typeof block.type === 'string' && NEW_FORMAT_BLOCK_TYPES.includes(block.type)) {
        report(context, path);

        return [];
    }

    const whole = writeWhole(block, path, context);
    if (whole === null) {
        return [];
    }

    if (breakAfterColumn !== undefined) {
        setOwn(whole, 'breakAfterColumn', breakAfterColumn);
    }

    return [whole];
};

const mapList = (block: StoredNode, spec: ListSpec, options: BlockOptions): LegacyElement[] => {
    const { path, breakAfterColumn, context } = options;
    if (isTooDeep(path, context)) {
        return [];
    }

    const children = readNodeList(block.children);
    if (children === null || children.length === 0) {
        report(context, path);

        return [];
    }

    if (spec.isNumbered && block.start !== undefined) {
        report(context, path);
    }

    const nodes: LegacyNode[] = [];
    for (let index = 0; index < children.length; index++) {
        const child = children[index];
        const childPath = [...path, index];
        const written = mapListChild(child, { path: childPath, breakAfterColumn: undefined, context });

        for (const node of written) {
            nodes.push(node);
        }
    }

    const declared = readBreakEntries(breakAfterColumn);
    const undeclared = readUndeclaredEntries(block, spec.declaredKeys);

    return [createLegacyElement(spec.legacyType, declared, undeclared, nodes)];
};

const mapListChild = (child: StoredNode, options: BlockOptions): LegacyElement[] => {
    if (child.type === 'listItem') {
        return mapListItem(child, options);
    }

    return mapUnknownBlock(child, options);
};

const readCheckedFlag = (item: StoredNode): boolean | null => {
    switch (item.checked) {
        case undefined:
        case false:
            return false;
        case true:
            return true;
        default:
            // The checked value is an arbitrary stored value: 'inProgress' and anything else has no legacy form.
            return null;
    }
};

const collectCheckItems = (list: StoredNode, options: CheckItemOptions): void => {
    const { path, level, writes, context } = options;
    if (isTooDeep(path, context)) {
        return;
    }

    const items = readNodeList(list.children);
    if (items === null || items.length === 0) {
        report(context, path);

        return;
    }

    if (readUndeclaredEntries(list, CHECK_LIST_KEYS).length > 0) {
        report(context, path);
    }

    for (let index = 0; index < items.length; index++) {
        collectCheckItem(items[index], { path: [...path, index], level, writes, context });
    }
};

const collectCheckItem = (item: StoredNode, options: CheckItemOptions): void => {
    const { path, level, writes, context } = options;
    const children = readNodeList(item.children);
    const checked = readCheckedFlag(item);
    if (item.type !== 'checkItem' || children === null || checked === null) {
        report(context, path);

        return;
    }

    const paragraph = children[CHECK_ITEM_PARAGRAPH_INDEX];
    const nestedList = children[CHECK_ITEM_NESTED_LIST_INDEX];
    const hasValidShape =
        paragraph !== undefined &&
        paragraph.type === 'paragraph' &&
        (nestedList === undefined || nestedList.type === 'checkList') &&
        children.length <= CHECK_ITEM_NESTED_LIST_INDEX + 1;
    if (!hasValidShape) {
        report(context, path);

        return;
    }

    const inline = mapInline(paragraph, { path: [...path, CHECK_ITEM_PARAGRAPH_INDEX], context });
    if (inline === null) {
        return;
    }

    writes.push({
        level,
        align: readAlignEntries(paragraph),
        checked,
        undeclared: [
            ...readUndeclaredEntries(item, CHECK_ITEM_KEYS),
            ...readUndeclaredEntries(paragraph, PARAGRAPH_KEYS),
        ],
        children: inline,
    });

    if (nestedList !== undefined) {
        collectCheckItems(nestedList, {
            path: [...path, CHECK_ITEM_NESTED_LIST_INDEX],
            level: level + 1,
            writes,
            context,
        });
    }
};

const createCheckboxItem = (write: CheckItemWrite, breakAfterColumn: ColumnBreakValue | undefined): LegacyElement => {
    const declared = [...write.align];

    if (write.level > MIN_INDENT) {
        declared.push({ key: 'indent', value: write.level });
    }

    if (write.checked) {
        declared.push({ key: 'checked', value: true });
    }

    declared.push(...readBreakEntries(breakAfterColumn));

    return createLegacyElement(CHECKBOX_ITEM_TYPE, declared, write.undeclared, write.children);
};

const mapCheckList = (list: StoredNode, options: BlockOptions): LegacyElement[] => {
    const { path, breakAfterColumn, context } = options;
    const writes: CheckItemWrite[] = [];
    collectCheckItems(list, { path, level: MIN_INDENT, writes, context });

    return writes.map((write, index) => {
        if (index === writes.length - 1) {
            return createCheckboxItem(write, breakAfterColumn);
        }

        return createCheckboxItem(write, undefined);
    });
};

const mapTopLevelBlock = (block: StoredNode, options: BlockOptions): LegacyElement[] => {
    switch (block.type) {
        case 'paragraph':
            return mapTextBlock(block, PARAGRAPH_SPEC, options);
        case 'quote':
            return mapTextBlock(block, QUOTE_SPEC, options);
        case 'textStyle':
            return mapTextStyleBlock(block, options);
        case 'bulletList':
            return mapList(block, BULLET_LIST_SPEC, options);
        case 'numberedList':
            return mapList(block, NUMBERED_LIST_SPEC, options);
        case 'checkList':
            return mapCheckList(block, options);
        default:
            // The block type is an arbitrary stored value, not a union: any other type is unknown content.
            return mapUnknownBlock(block, options);
    }
};

const takeColumnBreak = (context: ToLegacyContext): ColumnBreakValue => {
    const isActive = context.columnBreaks < context.columns - 1;
    context.columnBreaks += 1;

    if (isActive) {
        return ACTIVE_COLUMN_BREAK;
    }

    return INACTIVE_COLUMN_BREAK;
};

const mapTopLevel = (blocks: StoredNode[], context: ToLegacyContext): LegacyRichTextTree => {
    const nodes: LegacyRichTextTree = [];
    let previousType: unknown;
    let index = 0;

    while (index < blocks.length) {
        const block = blocks[index];
        const path = [index];
        const next: StoredNode | undefined = blocks[index + 1];

        if (block.type === 'columnBreak') {
            report(context, path);
            previousType = block.type;
            index += 1;
            continue;
        }

        let breakAfterColumn: ColumnBreakValue | undefined;
        let consumed = 1;
        let lastType = block.type;
        if (next !== undefined && next.type === 'columnBreak') {
            if (readUndeclaredEntries(next, COLUMN_BREAK_KEYS).length > 0) {
                report(context, [index + 1]);
            }

            breakAfterColumn = takeColumnBreak(context);
            consumed = 2;
            lastType = next.type;
        }

        if (block.type === 'checkList' && previousType === 'checkList') {
            report(context, path);
        } else {
            for (const node of mapTopLevelBlock(block, { path, breakAfterColumn, context })) {
                nodes.push(node);
            }
        }

        previousType = lastType;
        index += consumed;
    }

    return nodes;
};

/**
 * Writes a document of the new format as the legacy Slate tree the legacy editor stores, or says why it has no legacy form.
 * It never throws and gives the same result for the same input.
 *
 * @example
 * const result = toLegacyRichText(document, { columns: 2 });
 * if (result.outcome === 'exact') {
 *     save(JSON.stringify(result.value));
 * }
 */
export const toLegacyRichText = (
    document: OpenRichTextDocument,
    options: ToLegacyRichTextOptions = {},
): ToLegacyRichTextResult => {
    const { columns = DEFAULT_COLUMNS } = options;
    const context: ToLegacyContext = { diagnostics: [], columns, columnBreaks: 0 };
    const blocks = readNodeList(document.blocks);
    if (blocks === null) {
        return { outcome: 'not-reversible', value: null, diagnostics: [{ code: 'no-legacy-form', path: [] }] };
    }

    for (const key of Object.keys(document)) {
        if (!DOCUMENT_KEYS.includes(key)) {
            report(context, []);
        }
    }

    const value = mapTopLevel(blocks, context);
    if (context.diagnostics.length > 0) {
        return { outcome: 'not-reversible', value: null, diagnostics: context.diagnostics };
    }

    return { outcome: 'exact', value, diagnostics: [] };
};
