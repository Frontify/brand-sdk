/* (c) Copyright Frontify Ltd., all rights reserved. */

import { readAlignment } from './alignment';
import { parseLegacyColor } from './color';
import { copyValue, setOwn } from './copyValue';
import { isLegacyText } from './inspectLegacyTree';
import { isSafeHref, readButtonAppearance, readsAsNewTab } from './link';
import {
    type LegacyElement,
    type LegacyNode,
    type LegacyRichTextPath,
    type LegacyRichTextReviewCode,
    type LegacyRichTextReviewDiagnostic,
    type LegacyRichTextTree,
    type LegacyText,
    type LinkAppearance,
    type LinkValue,
    type MentionInline,
    type OpenBlock,
    type OpenInline,
    type ResolveMention,
    type TextStyleName,
} from './types';
import { TEXT_MARK_KEYS, isTextStyleName } from './vocabulary';

type OpenNode = OpenBlock & { [property: string]: unknown };
type OpenText = Extract<OpenInline, { text: string }>;
type OpenInlineElement = Exclude<OpenInline, OpenText>;
type ButtonLinkValue = Extract<LinkValue, { appearance: unknown }>;

type FromLegacyTreeOptions = { resolveMention?: ResolveMention };
type FromLegacyTreeResult = { blocks: OpenBlock[]; diagnostics: LegacyRichTextReviewDiagnostic[] };

type MappingContext = { diagnostics: LegacyRichTextReviewDiagnostic[]; resolveMention?: ResolveMention };
type BlockPosition = 'topLevel' | 'nested';
type TextBlockSpec = { type: 'paragraph' } | { type: 'quote' } | { type: 'textStyle'; style: TextStyleName };
type ListType = 'bulletList' | 'numberedList';

type BlockOptions = { path: LegacyRichTextPath; position: BlockPosition; context: MappingContext };
type TextBlockOptions = BlockOptions & { spec: TextBlockSpec };
type ListOptions = BlockOptions & { listType: ListType };
type InlineOptions = {
    parentPath: LegacyRichTextPath;
    firstIndex: number;
    blockStyle: string;
    context: MappingContext;
};
type InlineElementOptions = { path: LegacyRichTextPath; blockStyle: string; context: MappingContext };
type TextLeafOptions = InlineElementOptions & { link?: LinkValue };
type MentionOptions = { path: LegacyRichTextPath; context: MappingContext };
type UndeclaredPropertiesOptions = {
    element: LegacyElement;
    acceptedKeys: readonly string[];
    reservedKeys: readonly string[];
    target: object;
    path: LegacyRichTextPath;
    context: MappingContext;
};

type MarkEntry = { key: string; value: unknown };
type CheckItem = { node: OpenNode; children: OpenBlock[]; level: number; breaksColumn: boolean };
type CheckListFrame = { items: OpenBlock[]; itemChildren: OpenBlock[] };
type CheckRunMapping = { blocks: OpenBlock[]; nextIndex: number };
type ListItemChild = { kind: 'inline' } | { kind: 'element'; element: LegacyElement };
type LinkReading =
    | { status: 'linked'; link: LinkValue }
    | { status: 'button-style-unknown'; link: LinkValue }
    | { status: 'unsafe' };
type MentionNames = Pick<MentionInline, 'username' | 'name'>;
type MentionCategoryReading = { status: 'known'; kind: MentionInline['kind'] } | { status: 'unknown' };

const BLOCK_KEYS = ['type', 'children'];
const LINK_KEYS = ['type', 'children', 'url', 'target', 'chosenLink'];
const BUTTON_KEYS = [...LINK_KEYS, 'buttonStyle'];
const MENTION_KEYS = ['type', 'children', 'id', 'category'];
const BARE_INLINE_TYPES = ['a', 'button', 'mention'];

// Keys the new format gives a meaning of its own; a legacy value under them must not read as that meaning.
const RESERVED_BLOCK_KEYS = ['style', 'start'];
const RESERVED_CHECK_ITEM_KEYS = [...RESERVED_BLOCK_KEYS, 'checked'];
const RESERVED_TEXT_KEYS = ['type', 'fontColor', 'link', ...TEXT_MARK_KEYS];

const COLUMN_BREAK_VALUES = ['active', 'inactive'];
const DEFAULT_BLOCK_STYLE = 'p';
const QUOTE_BLOCK_STYLE = 'quote';
const DEFAULT_BUTTON_APPEARANCE: LinkAppearance = 'primary';
const LINE_BREAK = '\n';
const CHECKBOX_ITEM_TYPE = 'checkbox-item';
const LIST_TYPES = ['ul', 'ol'];
const LIST_ITEM_TYPE = 'li';
const LIST_ITEM_PARAGRAPH_TYPE = 'lic';
const MIN_CHECK_LEVEL = 1;

const isOpenText = (inline: OpenInline): inline is OpenText => {
    return inline.type === undefined;
};

const report = (context: MappingContext, code: LegacyRichTextReviewCode, path: LegacyRichTextPath): void => {
    context.diagnostics.push({ code, path });
};

const copyElementInto = (target: object, element: LegacyElement): void => {
    for (const key of Object.keys(element)) {
        setOwn(target, key, copyValue(element[key]));
    }
};

const keepWholeBlock = (element: LegacyElement): OpenNode => {
    const copy: OpenNode = { type: element.type };
    copyElementInto(copy, element);

    return copy;
};

const keepWholeInline = (element: LegacyElement): OpenInlineElement => {
    const copy: OpenInlineElement = { type: element.type };
    copyElementInto(copy, element);

    return copy;
};

const copyUndeclaredProperties = (options: UndeclaredPropertiesOptions): void => {
    const { element, acceptedKeys, reservedKeys, target, path, context } = options;

    for (const key of Object.keys(element)) {
        if (acceptedKeys.includes(key)) {
            continue;
        }

        report(context, 'unknown-property', path);
        if (!reservedKeys.includes(key)) {
            setOwn(target, key, copyValue(element[key]));
        }
    }
};

const reportUnknownProperties = (context: MappingContext, keys: string[], path: LegacyRichTextPath): void => {
    for (const _key of keys) {
        report(context, 'unknown-property', path);
    }
};

const startsNewColumn = (element: LegacyElement, position: BlockPosition): boolean => {
    if (position === 'nested') {
        return false;
    }

    const { breakAfterColumn } = element;
    return typeof breakAfterColumn === 'string' && COLUMN_BREAK_VALUES.includes(breakAfterColumn);
};

const blockStyleOf = (spec: TextBlockSpec): string => {
    switch (spec.type) {
        case 'paragraph':
            return DEFAULT_BLOCK_STYLE;
        case 'quote':
            return QUOTE_BLOCK_STYLE;
        case 'textStyle':
            return spec.style;
    }
};

const haveSameMarks = (first: OpenText, second: OpenText): boolean => {
    const firstKeys = Object.keys(first).filter((key) => key !== 'text');
    const secondKeys = Object.keys(second).filter((key) => key !== 'text');
    if (firstKeys.length !== secondKeys.length) {
        return false;
    }

    for (const key of firstKeys) {
        if (!secondKeys.includes(key) || JSON.stringify(first[key]) !== JSON.stringify(second[key])) {
            return false;
        }
    }

    return true;
};

const mergeAdjacentText = (inlines: OpenInline[]): OpenInline[] => {
    const merged: OpenInline[] = [];

    for (const inline of inlines) {
        const previous: OpenInline | undefined = merged[merged.length - 1];
        if (previous !== undefined && isOpenText(previous) && isOpenText(inline) && haveSameMarks(previous, inline)) {
            previous.text += inline.text;
            continue;
        }

        merged.push(inline);
    }

    return merged;
};

const createText = (text: string, marks: MarkEntry[]): OpenText => {
    const leaf: OpenText = { text };
    for (const mark of marks) {
        setOwn(leaf, mark.key, copyValue(mark.value));
    }

    return leaf;
};

const readTextMarks = (leaf: LegacyText, options: TextLeafOptions): MarkEntry[] => {
    const { path, blockStyle, link, context } = options;
    const entries: MarkEntry[] = [];
    const acceptedKeys = ['text'];

    for (const key of TEXT_MARK_KEYS) {
        const value = leaf[key];
        if (value === false) {
            acceptedKeys.push(key);
            continue;
        }

        if (value !== true) {
            continue;
        }

        acceptedKeys.push(key);
        if (key === 'superscript' && leaf.subscript === true) {
            report(context, 'excluded-marks', path);
            continue;
        }

        entries.push({ key, value: true });
    }

    if (leaf.color !== undefined) {
        acceptedKeys.push('color');
        const color = parseLegacyColor(leaf.color);
        if (color === null) {
            report(context, 'color-unparsed', path);
        } else {
            entries.push({ key: 'fontColor', value: { color } });
        }
    }

    if (link !== undefined) {
        entries.push({ key: 'link', value: link });
    }

    if (leaf.textStyle === blockStyle) {
        acceptedKeys.push('textStyle');
    }

    for (const key of Object.keys(leaf)) {
        if (acceptedKeys.includes(key)) {
            continue;
        }

        report(context, 'unknown-property', path);
        if (!RESERVED_TEXT_KEYS.includes(key)) {
            entries.push({ key, value: leaf[key] });
        }
    }

    return entries;
};

const appendTextLeaf = (output: OpenInline[], leaf: LegacyText, options: TextLeafOptions): void => {
    if (leaf.text === '') {
        return;
    }

    const marks = readTextMarks(leaf, options);
    const parts = leaf.text.split(LINE_BREAK);

    for (let index = 0; index < parts.length; index++) {
        if (index > 0) {
            output.push({ type: 'break' });
        }

        if (parts[index] !== '') {
            output.push(createText(parts[index], marks));
        }
    }
};

const readSearchResultLink = (chosenLink: object): unknown => {
    if (!('searchResult' in chosenLink)) {
        return undefined;
    }

    const { searchResult } = chosenLink;
    if (typeof searchResult !== 'object' || searchResult === null || !('link' in searchResult)) {
        return undefined;
    }

    return searchResult.link;
};

const createLinkValue = (href: string, openInNewTab: boolean, appearance: LinkAppearance | undefined): LinkValue => {
    if (appearance === undefined) {
        const link: LinkValue = { href };
        if (openInNewTab) {
            link.openInNewTab = true;
        }

        return link;
    }

    const link: ButtonLinkValue = { href, appearance };
    if (openInNewTab) {
        link.openInNewTab = true;
    }

    return link;
};

const readAnchor = (element: LegacyElement): LinkReading => {
    const { chosenLink } = element;
    let href: unknown = element.url;
    let openInNewTab = readsAsNewTab(element.target);

    if (typeof chosenLink === 'object' && chosenLink !== null) {
        const searchResultLink = readSearchResultLink(chosenLink);
        if (typeof searchResultLink === 'string' && searchResultLink !== '') {
            href = searchResultLink;
        }

        openInNewTab = 'openInNewTab' in chosenLink && chosenLink.openInNewTab === true;
    }

    if (!isSafeHref(href)) {
        return { status: 'unsafe' };
    }

    return { status: 'linked', link: createLinkValue(href, openInNewTab, undefined) };
};

const readButton = (element: LegacyElement): LinkReading => {
    const href = element.url;
    if (!isSafeHref(href)) {
        return { status: 'unsafe' };
    }

    const { target, buttonStyle } = element;
    let openInNewTab = true;
    if (target !== undefined && target !== null) {
        openInNewTab = readsAsNewTab(target);
    }

    if (buttonStyle === undefined || buttonStyle === null) {
        return { status: 'linked', link: createLinkValue(href, openInNewTab, DEFAULT_BUTTON_APPEARANCE) };
    }

    const appearance = readButtonAppearance(buttonStyle);
    if (appearance === undefined) {
        return { status: 'button-style-unknown', link: createLinkValue(href, openInNewTab, undefined) };
    }

    return { status: 'linked', link: createLinkValue(href, openInNewTab, appearance) };
};

const readLinkKeys = (element: LegacyElement): readonly string[] => {
    if (element.type === 'button') {
        return BUTTON_KEYS;
    }

    return LINK_KEYS;
};

const readLink = (element: LegacyElement): LinkReading => {
    if (element.type === 'button') {
        return readButton(element);
    }

    return readAnchor(element);
};

const readMentionCategory = (category: unknown): MentionCategoryReading => {
    switch (category) {
        case 'user':
            return { status: 'known', kind: undefined };
        case 'group':
            return { status: 'known', kind: 'group' };
        case 'all':
            return { status: 'known', kind: 'all' };
        default:
            // The category is an arbitrary stored value, not a union: anything else is read as unknown.
            return { status: 'unknown' };
    }
};

const readUnresolvedMentionNames = (options: MentionOptions): MentionNames => {
    report(options.context, 'mention-unresolved', options.path);

    return { username: '', name: '' };
};

const readMentionNames = (kind: MentionInline['kind'], id: string, options: MentionOptions): MentionNames => {
    const { resolveMention } = options.context;
    if (resolveMention === undefined) {
        return readUnresolvedMentionNames(options);
    }

    const lookup = resolveMention(kind, id);
    switch (lookup.status) {
        case 'resolved':
            return { username: lookup.username, name: lookup.name };
        case 'unknown':
            return readUnresolvedMentionNames(options);
    }
};

const mapMention = (element: LegacyElement, options: MentionOptions): OpenInline => {
    const { path, context } = options;
    const extraKeys = Object.keys(element).filter((key) => !MENTION_KEYS.includes(key));
    if (extraKeys.length > 0) {
        reportUnknownProperties(context, extraKeys, path);

        return keepWholeInline(element);
    }

    const { id } = element;
    const category = readMentionCategory(element.category);
    if ((typeof id !== 'string' && typeof id !== 'number') || category.status === 'unknown') {
        report(context, 'unknown-element', path);

        return keepWholeInline(element);
    }

    const mentionId = String(id);
    const names = readMentionNames(category.kind, mentionId, options);
    const mention: MentionInline = { type: 'mention', id: mentionId, username: names.username, name: names.name };
    if (category.kind !== undefined) {
        mention.kind = category.kind;
    }

    return mention;
};

const appendLink = (output: OpenInline[], element: LegacyElement, options: InlineElementOptions): void => {
    const { path, blockStyle, context } = options;
    const allowedKeys = readLinkKeys(element);
    const extraKeys = Object.keys(element).filter((key) => !allowedKeys.includes(key));
    if (extraKeys.length > 0) {
        reportUnknownProperties(context, extraKeys, path);
        output.push(keepWholeInline(element));
        return;
    }

    const reading = readLink(element);
    let link: LinkValue | undefined;
    switch (reading.status) {
        case 'linked':
            link = reading.link;
            break;
        case 'button-style-unknown':
            report(context, 'button-style-unknown', path);
            link = reading.link;
            break;
        case 'unsafe':
            report(context, 'link-unsafe', path);
            break;
    }

    for (let index = 0; index < element.children.length; index++) {
        const child = element.children[index];
        const childPath = [...path, index];

        if (isLegacyText(child)) {
            appendTextLeaf(output, child, { path: childPath, blockStyle, link, context });
        } else if (child.type === 'mention') {
            output.push(mapMention(child, { path: childPath, context }));
        } else {
            report(context, 'unknown-element', childPath);
            output.push(keepWholeInline(child));
        }
    }
};

const appendInlineElement = (output: OpenInline[], element: LegacyElement, options: InlineElementOptions): void => {
    switch (element.type) {
        case 'a':
        case 'button':
            appendLink(output, element, options);
            return;
        case 'mention':
            output.push(mapMention(element, { path: options.path, context: options.context }));
            return;
        default:
            // The element type is an arbitrary stored string, not a union: any other type is kept whole.
            report(options.context, 'unknown-element', options.path);
            output.push(keepWholeInline(element));
    }
};

const mapInline = (nodes: LegacyNode[], options: InlineOptions): OpenInline[] => {
    const { parentPath, firstIndex, blockStyle, context } = options;
    const inlines: OpenInline[] = [];

    for (let index = 0; index < nodes.length; index++) {
        const node = nodes[index];
        const path = [...parentPath, firstIndex + index];

        if (isLegacyText(node)) {
            appendTextLeaf(inlines, node, { path, blockStyle, context });
        } else {
            appendInlineElement(inlines, node, { path, blockStyle, context });
        }
    }

    return mergeAdjacentText(inlines);
};

const mapTextBlock = (element: LegacyElement, options: TextBlockOptions): OpenNode => {
    const { spec, path, position, context } = options;
    const node: OpenNode = { type: spec.type };
    const acceptedKeys = [...BLOCK_KEYS];

    if (spec.type === 'textStyle') {
        node.style = spec.style;
    }

    const align = readAlignment(element.align);
    if (align !== undefined) {
        node.align = align;
        acceptedKeys.push('align');
    }

    if (startsNewColumn(element, position)) {
        acceptedKeys.push('breakAfterColumn');
    }

    copyUndeclaredProperties({ element, acceptedKeys, reservedKeys: RESERVED_BLOCK_KEYS, target: node, path, context });
    node.children = mapInline(element.children, {
        parentPath: path,
        firstIndex: 0,
        blockStyle: blockStyleOf(spec),
        context,
    });

    return node;
};

const mapParagraph = (nodes: LegacyNode[], options: InlineOptions): OpenNode => {
    return { type: 'paragraph', children: mapInline(nodes, options) };
};

const mapStrayText = (text: LegacyText, options: InlineOptions): OpenNode => {
    report(options.context, 'unknown-element', [...options.parentPath, options.firstIndex]);

    return mapParagraph([text], options);
};

const readListItemChild = (node: LegacyNode): ListItemChild => {
    if (isLegacyText(node) || BARE_INLINE_TYPES.includes(node.type)) {
        return { kind: 'inline' };
    }

    return { kind: 'element', element: node };
};

const isEmptyList = (element: LegacyElement): boolean => {
    return LIST_TYPES.includes(element.type) && element.children.length === 0;
};

const mapListItem = (element: LegacyElement, options: BlockOptions): OpenNode => {
    const { path, context } = options;
    const node: OpenNode = { type: 'listItem' };
    const children: OpenBlock[] = [];
    let index = 0;

    copyUndeclaredProperties({
        element,
        acceptedKeys: BLOCK_KEYS,
        reservedKeys: RESERVED_BLOCK_KEYS,
        target: node,
        path,
        context,
    });

    while (index < element.children.length) {
        const child = readListItemChild(element.children[index]);
        switch (child.kind) {
            case 'inline': {
                let end = index + 1;
                while (end < element.children.length && readListItemChild(element.children[end]).kind === 'inline') {
                    end += 1;
                }

                children.push(
                    mapParagraph(element.children.slice(index, end), {
                        parentPath: path,
                        firstIndex: index,
                        blockStyle: DEFAULT_BLOCK_STYLE,
                        context,
                    }),
                );
                index = end;
                break;
            }
            case 'element':
                children.push(
                    mapListItemElement(child.element, { path: [...path, index], position: 'nested', context }),
                );
                index += 1;
                break;
        }
    }

    if (children.length === 0) {
        children.push({ type: 'paragraph', children: [] });
    }

    node.children = children;

    return node;
};

const mapListItemElement = (element: LegacyElement, options: BlockOptions): OpenBlock => {
    if (isEmptyList(element)) {
        report(options.context, 'unknown-element', options.path);

        return keepWholeBlock(element);
    }

    switch (element.type) {
        case LIST_ITEM_PARAGRAPH_TYPE:
            return mapTextBlock(element, { ...options, spec: { type: 'paragraph' } });
        case 'ul':
            return mapList(element, { ...options, listType: 'bulletList' });
        case 'ol':
            return mapList(element, { ...options, listType: 'numberedList' });
        default:
            // The element type is an arbitrary stored string, not a union: any other type is kept whole.
            report(options.context, 'unknown-element', options.path);
            return keepWholeBlock(element);
    }
};

const mapList = (element: LegacyElement, options: ListOptions): OpenNode => {
    const { listType, path, position, context } = options;
    const node: OpenNode = { type: listType };
    const children: OpenBlock[] = [];
    const acceptedKeys = [...BLOCK_KEYS];

    if (startsNewColumn(element, position)) {
        acceptedKeys.push('breakAfterColumn');
    }

    copyUndeclaredProperties({ element, acceptedKeys, reservedKeys: RESERVED_BLOCK_KEYS, target: node, path, context });

    for (let index = 0; index < element.children.length; index++) {
        const child = element.children[index];
        const childPath = [...path, index];

        if (isLegacyText(child)) {
            const paragraph = mapStrayText(child, {
                parentPath: path,
                firstIndex: index,
                blockStyle: DEFAULT_BLOCK_STYLE,
                context,
            });
            children.push({ type: 'listItem', children: [paragraph] });
        } else if (child.type === LIST_ITEM_TYPE) {
            children.push(mapListItem(child, { path: childPath, position: 'nested', context }));
        } else {
            report(context, 'unknown-element', childPath);
            children.push(keepWholeBlock(child));
        }
    }

    node.children = children;

    return node;
};

const buildCheckItem = (element: LegacyElement, path: LegacyRichTextPath, context: MappingContext): CheckItem => {
    const node: OpenNode = { type: 'checkItem' };
    const acceptedKeys = [...BLOCK_KEYS];
    let level = MIN_CHECK_LEVEL;

    const { indent, checked } = element;
    if (typeof indent === 'number' && Number.isInteger(indent) && indent >= MIN_CHECK_LEVEL) {
        level = indent;
        acceptedKeys.push('indent');
    }

    if (checked === true) {
        node.checked = true;
        acceptedKeys.push('checked');
    }

    if (checked === false) {
        acceptedKeys.push('checked');
    }

    const breaksColumn = startsNewColumn(element, 'topLevel');
    if (breaksColumn) {
        acceptedKeys.push('breakAfterColumn');
    }

    const paragraph: OpenNode = { type: 'paragraph' };
    const align = readAlignment(element.align);
    if (align !== undefined) {
        paragraph.align = align;
        acceptedKeys.push('align');
    }

    paragraph.children = mapInline(element.children, {
        parentPath: path,
        firstIndex: 0,
        blockStyle: DEFAULT_BLOCK_STYLE,
        context,
    });

    copyUndeclaredProperties({
        element,
        acceptedKeys,
        reservedKeys: RESERVED_CHECK_ITEM_KEYS,
        target: node,
        path,
        context,
    });

    const children: OpenBlock[] = [paragraph];
    node.children = children;

    return { node, children, level, breaksColumn };
};

const mapCheckRun = (tree: LegacyRichTextTree, startIndex: number, context: MappingContext): CheckRunMapping => {
    const blocks: OpenBlock[] = [];
    const frames: CheckListFrame[] = [];
    let index = startIndex;

    while (index < tree.length) {
        const element = tree[index];
        if (isLegacyText(element) || element.type !== CHECKBOX_ITEM_TYPE) {
            break;
        }

        const path = [index];
        const item = buildCheckItem(element, path, context);
        const level = Math.min(item.level, frames.length + 1);
        if (item.level > frames.length + 1) {
            report(context, 'indent-jump', path);
        }

        while (frames.length > level) {
            frames.pop();
        }

        if (frames.length === level) {
            const frame = frames[frames.length - 1];
            frame.items.push(item.node);
            frame.itemChildren = item.children;
        } else {
            const items: OpenBlock[] = [item.node];
            const list: OpenBlock = { type: 'checkList', children: items };
            if (frames.length === 0) {
                blocks.push(list);
            } else {
                frames[frames.length - 1].itemChildren.push(list);
            }

            frames.push({ items, itemChildren: item.children });
        }

        index += 1;
        if (item.breaksColumn) {
            blocks.push({ type: 'columnBreak' });
            break;
        }
    }

    return { blocks, nextIndex: index };
};

const mapKnownBlock = (element: LegacyElement, options: BlockOptions): OpenNode | null => {
    if (isEmptyList(element)) {
        return null;
    }

    const { type } = element;
    if (isTextStyleName(type)) {
        return mapTextBlock(element, { ...options, spec: { type: 'textStyle', style: type } });
    }

    switch (type) {
        case 'p':
            return mapTextBlock(element, { ...options, spec: { type: 'paragraph' } });
        case 'quote':
            return mapTextBlock(element, { ...options, spec: { type: 'quote' } });
        case 'ul':
            return mapList(element, { ...options, listType: 'bulletList' });
        case 'ol':
            return mapList(element, { ...options, listType: 'numberedList' });
        default:
            // The element type is an arbitrary stored string, not a union: any other type is kept whole.
            return null;
    }
};

const mapTopLevelBlock = (element: LegacyElement, options: BlockOptions): OpenBlock[] => {
    const node = mapKnownBlock(element, options);
    if (node === null) {
        report(options.context, 'unknown-element', options.path);

        return [keepWholeBlock(element)];
    }

    const blocks: OpenBlock[] = [node];
    if (startsNewColumn(element, options.position)) {
        blocks.push({ type: 'columnBreak' });
    }

    return blocks;
};

const mapTopLevel = (tree: LegacyRichTextTree, context: MappingContext): OpenBlock[] => {
    const blocks: OpenBlock[] = [];
    let index = 0;

    while (index < tree.length) {
        const node = tree[index];

        if (isLegacyText(node)) {
            blocks.push(
                mapStrayText(node, { parentPath: [], firstIndex: index, blockStyle: DEFAULT_BLOCK_STYLE, context }),
            );
            index += 1;
            continue;
        }

        if (node.type === CHECKBOX_ITEM_TYPE) {
            const run = mapCheckRun(tree, index, context);
            blocks.push(...run.blocks);
            index = run.nextIndex;
            continue;
        }

        blocks.push(...mapTopLevelBlock(node, { path: [index], position: 'topLevel', context }));
        index += 1;
    }

    return blocks;
};

/** Maps a validated legacy tree to blocks of the open document, listing every place a human should look at. */
export const fromLegacyTree = (tree: LegacyRichTextTree, options: FromLegacyTreeOptions): FromLegacyTreeResult => {
    const context: MappingContext = { diagnostics: [], resolveMention: options.resolveMention };
    const blocks = mapTopLevel(tree, context);

    return { blocks, diagnostics: context.diagnostics };
};
