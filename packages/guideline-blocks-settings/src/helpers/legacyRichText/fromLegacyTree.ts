/* (c) Copyright Frontify Ltd., all rights reserved. */

import { readAlignment } from './alignment';
import { parseLegacyColor } from './color';
import { type CopyBudget, copyValue, createCopyBudget, isDeepEqual, setOwn } from './copyValue';
import { isLegacyText } from './legacyNode';
import { MAX_COPIED_VALUES, MAX_DEPTH } from './limits';
import { createLinkValue, isSafeHref, readButtonAppearance, readSearchResultLink, readsAsNewTab } from './link';
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
import {
    LEGACY_ALIGN_KEY,
    LEGACY_BREAK_AFTER_COLUMN_KEY,
    LEGACY_BULLET_LIST_TYPE,
    LEGACY_BUTTON_STYLE_KEY,
    LEGACY_BUTTON_TYPE,
    LEGACY_CATEGORY_KEY,
    LEGACY_CHECKBOX_ITEM_TYPE,
    LEGACY_CHECKED_KEY,
    LEGACY_CHOSEN_LINK_KEY,
    LEGACY_COLOR_KEY,
    LEGACY_ID_KEY,
    LEGACY_INDENT_KEY,
    LEGACY_LINK_TYPE,
    LEGACY_LIST_ITEM_PARAGRAPH_TYPE,
    LEGACY_LIST_ITEM_TYPE,
    LEGACY_MENTION_TYPE,
    LEGACY_NUMBERED_LIST_TYPE,
    LEGACY_PARAGRAPH_TYPE,
    LEGACY_QUOTE_TYPE,
    LEGACY_TARGET_KEY,
    LEGACY_TEXT_STYLE_KEY,
    LEGACY_URL_KEY,
    LINE_BREAK,
    MIN_CHECK_LEVEL,
    TEXT_MARK_KEYS,
    isColumnBreakValue,
    isReservedType,
    isTextStyleName,
    readMentionKind,
} from './vocabulary';

type OpenNode = OpenBlock & { [property: string]: unknown };
type OpenText = Extract<OpenInline, { text: string }>;
type OpenInlineElement = Exclude<OpenInline, OpenText>;

type FromLegacyTreeOptions = { resolveMention?: ResolveMention };
type FromLegacyTreeResult =
    | { status: 'mapped'; blocks: OpenBlock[]; diagnostics: LegacyRichTextReviewDiagnostic[] }
    | { status: 'limit-exceeded' }
    | { status: 'reserved-type'; path: LegacyRichTextPath };

type MappingContext = {
    diagnostics: LegacyRichTextReviewDiagnostic[];
    copyBudget: CopyBudget;
    reservedTypePath?: LegacyRichTextPath;
    resolveMention?: ResolveMention;
};
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
type CheckRunMapping = { status: 'mapped'; blocks: OpenBlock[]; nextIndex: number } | { status: 'limit-exceeded' };
type TopLevelMapping = { status: 'mapped'; blocks: OpenBlock[] } | { status: 'limit-exceeded' };
type ListItemChild = { kind: 'inline' } | { kind: 'element'; element: LegacyElement };
type LinkReading =
    | { status: 'linked'; link: LinkValue }
    | { status: 'button-style-unknown'; link: LinkValue }
    | { status: 'chosen-link-unknown'; link: LinkValue }
    | { status: 'unsafe' };
type MentionNames = Pick<MentionInline, 'username' | 'name'>;

const BLOCK_KEYS = ['type', 'children'];
const LINK_KEYS = ['type', 'children', LEGACY_URL_KEY, LEGACY_TARGET_KEY, LEGACY_CHOSEN_LINK_KEY];
const BUTTON_KEYS = [...LINK_KEYS, LEGACY_BUTTON_STYLE_KEY];
const LEGACY_MENTION_KEYS = ['type', 'children', LEGACY_ID_KEY, LEGACY_CATEGORY_KEY];
const BARE_INLINE_TYPES = [LEGACY_LINK_TYPE, LEGACY_BUTTON_TYPE, LEGACY_MENTION_TYPE];

// Keys the new format gives a meaning of its own; a legacy value under them must not read as that meaning.
const RESERVED_BLOCK_KEYS = ['style', 'start'];
const RESERVED_CHECK_ITEM_KEYS = [...RESERVED_BLOCK_KEYS, 'checked'];
const RESERVED_TEXT_KEYS = ['type', 'children', 'fontColor', 'link', ...TEXT_MARK_KEYS];

const DEFAULT_BLOCK_STYLE = LEGACY_PARAGRAPH_TYPE;
const QUOTE_BLOCK_STYLE = LEGACY_QUOTE_TYPE;
const DEFAULT_BUTTON_APPEARANCE: LinkAppearance = 'primary';
const LIST_TYPES = [LEGACY_BULLET_LIST_TYPE, LEGACY_NUMBERED_LIST_TYPE];

const isOpenText = (inline: OpenInline): inline is OpenText => {
    return inline.type === undefined;
};

const report = (context: MappingContext, code: LegacyRichTextReviewCode, path: LegacyRichTextPath): void => {
    context.diagnostics.push({ code, path });
};

const copyElementInto = (target: object, element: LegacyElement, context: MappingContext): void => {
    for (const key of Object.keys(element)) {
        setOwn(target, key, copyValue(element[key], context.copyBudget));
    }
};

// A node kept whole keeps its type, so a type the new format declares would be read as a real node of it.
const noteReservedType = (element: LegacyElement, path: LegacyRichTextPath, context: MappingContext): void => {
    if (isReservedType(element.type) && context.reservedTypePath === undefined) {
        context.reservedTypePath = path;
    }
};

const keepWholeBlock = (element: LegacyElement, path: LegacyRichTextPath, context: MappingContext): OpenNode => {
    noteReservedType(element, path, context);
    const copy: OpenNode = { type: element.type };
    copyElementInto(copy, element, context);

    return copy;
};

const keepWholeInline = (
    element: LegacyElement,
    path: LegacyRichTextPath,
    context: MappingContext,
): OpenInlineElement => {
    noteReservedType(element, path, context);
    const copy: OpenInlineElement = { type: element.type };
    copyElementInto(copy, element, context);

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
            setOwn(target, key, copyValue(element[key], context.copyBudget));
        }
    }
};

// Fondue's align is a string union, so a value of another type is reported and left out.
const readNonStringAlignKeys = (element: LegacyElement): string[] => {
    if (typeof element[LEGACY_ALIGN_KEY] === 'string') {
        return [];
    }

    return [LEGACY_ALIGN_KEY];
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

    return isColumnBreakValue(element[LEGACY_BREAK_AFTER_COLUMN_KEY]);
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
    const secondKeys = new Set(Object.keys(second).filter((key) => key !== 'text'));
    if (firstKeys.length !== secondKeys.size) {
        return false;
    }

    for (const key of firstKeys) {
        if (!secondKeys.has(key) || !isDeepEqual(first[key], second[key])) {
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

// Every part gets its own leaf and copy of the marks, and all of it is charged, so a long text cannot multiply its marks.
const createText = (text: string, marks: MarkEntry[], context: MappingContext): OpenText => {
    const leaf: OpenText = { text };
    context.copyBudget.remaining -= 1;

    for (const mark of marks) {
        context.copyBudget.remaining -= 1;
        if (context.copyBudget.remaining < 0) {
            break;
        }

        setOwn(leaf, mark.key, copyValue(mark.value, context.copyBudget));
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

    if (leaf[LEGACY_COLOR_KEY] !== undefined) {
        acceptedKeys.push(LEGACY_COLOR_KEY);
        const color = parseLegacyColor(leaf[LEGACY_COLOR_KEY]);
        if (color === null) {
            report(context, 'color-unparsed', path);
        } else {
            entries.push({ key: 'fontColor', value: { color } });
        }
    }

    if (link !== undefined) {
        entries.push({ key: 'link', value: link });
    }

    if (leaf[LEGACY_TEXT_STYLE_KEY] === blockStyle) {
        acceptedKeys.push(LEGACY_TEXT_STYLE_KEY);
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
        if (options.context.copyBudget.remaining < 0) {
            return;
        }

        if (index > 0) {
            options.context.copyBudget.remaining -= 1;
            output.push({ type: 'break' });
        }

        if (parts[index] !== '') {
            output.push(createText(parts[index], marks, options.context));
        }
    }
};

const readChosenOpenInNewTab = (chosenLink: object): unknown => {
    if (!('openInNewTab' in chosenLink)) {
        return undefined;
    }

    return chosenLink.openInNewTab;
};

const readAnchor = (element: LegacyElement): LinkReading => {
    const chosenLink = element[LEGACY_CHOSEN_LINK_KEY];
    let href: unknown = element[LEGACY_URL_KEY];
    let openInNewTab = readsAsNewTab(element[LEGACY_TARGET_KEY]);
    let hasKnownChosenLink = true;

    if (typeof chosenLink === 'object' && chosenLink !== null) {
        const searchResultLink = readSearchResultLink(chosenLink);
        if (typeof searchResultLink === 'string' && searchResultLink !== '') {
            href = searchResultLink;
        }

        // The legacy display opens a new tab for any truthy value; only the boolean ones are the stored shape.
        const flag = readChosenOpenInNewTab(chosenLink);
        openInNewTab = Boolean(flag);
        hasKnownChosenLink = flag === true || flag === false || flag === undefined || flag === null;
    } else if (Boolean(chosenLink)) {
        // The legacy display takes any truthy chosenLink for a chosen link: no search result and no new tab.
        openInNewTab = false;
        hasKnownChosenLink = false;
    }

    if (!isSafeHref(href)) {
        return { status: 'unsafe' };
    }

    const link = createLinkValue({ href, openInNewTab, appearance: undefined });
    if (!hasKnownChosenLink) {
        return { status: 'chosen-link-unknown', link };
    }

    return { status: 'linked', link };
};

const readButton = (element: LegacyElement): LinkReading => {
    const href = element[LEGACY_URL_KEY];
    if (!isSafeHref(href)) {
        return { status: 'unsafe' };
    }

    const target = element[LEGACY_TARGET_KEY];
    const buttonStyle = element[LEGACY_BUTTON_STYLE_KEY];
    let openInNewTab = true;
    if (target !== undefined && target !== null) {
        openInNewTab = readsAsNewTab(target);
    }

    if (buttonStyle === undefined || buttonStyle === null) {
        return {
            status: 'linked',
            link: createLinkValue({ href, openInNewTab, appearance: DEFAULT_BUTTON_APPEARANCE }),
        };
    }

    const appearance = readButtonAppearance(buttonStyle);
    if (appearance === undefined) {
        return { status: 'button-style-unknown', link: createLinkValue({ href, openInNewTab, appearance: undefined }) };
    }

    return { status: 'linked', link: createLinkValue({ href, openInNewTab, appearance }) };
};

const readLinkKeys = (element: LegacyElement): readonly string[] => {
    if (element.type === LEGACY_BUTTON_TYPE) {
        return BUTTON_KEYS;
    }

    return LINK_KEYS;
};

const readLink = (element: LegacyElement): LinkReading => {
    if (element.type === LEGACY_BUTTON_TYPE) {
        return readButton(element);
    }

    return readAnchor(element);
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
    const extraKeys = Object.keys(element).filter((key) => !LEGACY_MENTION_KEYS.includes(key));
    if (extraKeys.length > 0) {
        reportUnknownProperties(context, extraKeys, path);
    }

    const id = element[LEGACY_ID_KEY];
    const category = readMentionKind(element[LEGACY_CATEGORY_KEY]);
    if ((typeof id !== 'string' && typeof id !== 'number') || category.status === 'unknown') {
        report(context, 'unknown-element', path);

        return keepWholeInline(element, path, context);
    }

    const mentionId = String(id);
    const names = readMentionNames(category.kind, mentionId, options);
    const mention: MentionInline = { type: 'mention', id: mentionId, username: names.username, name: names.name };
    if (category.kind !== undefined) {
        mention.kind = category.kind;
    }

    return mention;
};

// The new format's mention carries no link, so a link around one has no form there.
const readMentionPaths = (element: LegacyElement, path: LegacyRichTextPath): LegacyRichTextPath[] => {
    const paths: LegacyRichTextPath[] = [];

    for (let index = 0; index < element.children.length; index++) {
        const child = element.children[index];
        if (!isLegacyText(child) && child.type === LEGACY_MENTION_TYPE) {
            paths.push([...path, index]);
        }
    }

    return paths;
};

// A link lives on text leaves, so one with no text to put it on would lose its url and style.
const hasLinkableText = (element: LegacyElement): boolean => {
    return element.children.some((child) => {
        return isLegacyText(child) && child.text.split(LINE_BREAK).some((part) => part !== '');
    });
};

// A legacy button draws a break inside its box, and the new format's break carries no link.
const hasButtonLineBreak = (element: LegacyElement): boolean => {
    return (
        element.type === LEGACY_BUTTON_TYPE &&
        element.children.some((child) => isLegacyText(child) && child.text.includes(LINE_BREAK))
    );
};

// Two equal links side by side are one run for the new format, which would merge two buttons into one box.
const repeatsPreviousButton = (output: OpenInline[], element: LegacyElement, reading: LinkReading): boolean => {
    if (element.type !== LEGACY_BUTTON_TYPE || reading.status === 'unsafe') {
        return false;
    }

    const previous: OpenInline | undefined = output[output.length - 1];

    return previous !== undefined && isOpenText(previous) && isDeepEqual(previous.link, reading.link);
};

const appendLink = (output: OpenInline[], element: LegacyElement, options: InlineElementOptions): void => {
    const { path, blockStyle, context } = options;
    const allowedKeys = readLinkKeys(element);
    const extraKeys = Object.keys(element).filter((key) => !allowedKeys.includes(key));
    if (extraKeys.length > 0) {
        reportUnknownProperties(context, extraKeys, path);
        output.push(keepWholeInline(element, path, context));
        return;
    }

    const mentionPaths = readMentionPaths(element, path);
    if (mentionPaths.length > 0) {
        for (const mentionPath of mentionPaths) {
            report(context, 'unknown-element', mentionPath);
        }

        output.push(keepWholeInline(element, path, context));
        return;
    }

    if (!hasLinkableText(element) || hasButtonLineBreak(element)) {
        report(context, 'unknown-element', path);
        output.push(keepWholeInline(element, path, context));
        return;
    }

    const reading = readLink(element);
    if (repeatsPreviousButton(output, element, reading)) {
        report(context, 'unknown-element', path);
        output.push(keepWholeInline(element, path, context));
        return;
    }

    let link: LinkValue | undefined;
    switch (reading.status) {
        case 'linked':
            link = reading.link;
            break;
        case 'chosen-link-unknown':
            report(context, 'unknown-property', path);
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
        } else {
            report(context, 'unknown-element', childPath);
            output.push(keepWholeInline(child, childPath, context));
        }
    }
};

const appendInlineElement = (output: OpenInline[], element: LegacyElement, options: InlineElementOptions): void => {
    switch (element.type) {
        case LEGACY_LINK_TYPE:
        case LEGACY_BUTTON_TYPE:
            appendLink(output, element, options);
            return;
        case LEGACY_MENTION_TYPE:
            output.push(mapMention(element, { path: options.path, context: options.context }));
            return;
        default:
            // The element type is an arbitrary stored string, not a union: any other type is kept whole.
            report(options.context, 'unknown-element', options.path);
            output.push(keepWholeInline(element, options.path, options.context));
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

    const align = readAlignment(element[LEGACY_ALIGN_KEY]);
    if (align !== undefined) {
        node.align = align;
        acceptedKeys.push(LEGACY_ALIGN_KEY);
    }

    if (startsNewColumn(element, position)) {
        acceptedKeys.push(LEGACY_BREAK_AFTER_COLUMN_KEY);
    }

    copyUndeclaredProperties({
        element,
        acceptedKeys,
        reservedKeys: [...RESERVED_BLOCK_KEYS, ...readNonStringAlignKeys(element)],
        target: node,
        path,
        context,
    });
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

        return keepWholeBlock(element, options.path, options.context);
    }

    switch (element.type) {
        case LEGACY_LIST_ITEM_PARAGRAPH_TYPE:
            return mapTextBlock(element, { ...options, spec: { type: 'paragraph' } });
        case LEGACY_BULLET_LIST_TYPE:
            return mapList(element, { ...options, listType: 'bulletList' });
        case LEGACY_NUMBERED_LIST_TYPE:
            return mapList(element, { ...options, listType: 'numberedList' });
        default:
            // The element type is an arbitrary stored string, not a union: any other type is kept whole.
            report(options.context, 'unknown-element', options.path);
            return keepWholeBlock(element, options.path, options.context);
    }
};

const mapList = (element: LegacyElement, options: ListOptions): OpenNode => {
    const { listType, path, position, context } = options;
    const node: OpenNode = { type: listType };
    const children: OpenBlock[] = [];
    const acceptedKeys = [...BLOCK_KEYS];

    if (startsNewColumn(element, position)) {
        acceptedKeys.push(LEGACY_BREAK_AFTER_COLUMN_KEY);
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
        } else if (child.type === LEGACY_LIST_ITEM_TYPE) {
            children.push(mapListItem(child, { path: childPath, position: 'nested', context }));
        } else {
            report(context, 'unknown-element', childPath);
            children.push(keepWholeBlock(child, childPath, context));
        }
    }

    node.children = children;

    return node;
};

const buildCheckItem = (element: LegacyElement, path: LegacyRichTextPath, context: MappingContext): CheckItem => {
    const node: OpenNode = { type: 'checkItem' };
    const acceptedKeys = [...BLOCK_KEYS];
    let level = MIN_CHECK_LEVEL;

    const indent = element[LEGACY_INDENT_KEY];
    const checked = element[LEGACY_CHECKED_KEY];
    if (typeof indent === 'number' && Number.isInteger(indent) && indent >= MIN_CHECK_LEVEL) {
        level = indent;
        acceptedKeys.push(LEGACY_INDENT_KEY);
    }

    if (checked === true) {
        node.checked = true;
        acceptedKeys.push(LEGACY_CHECKED_KEY);
    }

    if (checked === false) {
        acceptedKeys.push(LEGACY_CHECKED_KEY);
    }

    const breaksColumn = startsNewColumn(element, 'topLevel');
    if (breaksColumn) {
        acceptedKeys.push(LEGACY_BREAK_AFTER_COLUMN_KEY);
    }

    const paragraph: OpenNode = { type: 'paragraph' };
    const align = readAlignment(element[LEGACY_ALIGN_KEY]);
    if (align !== undefined) {
        paragraph.align = align;
        acceptedKeys.push(LEGACY_ALIGN_KEY);
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
        reservedKeys: [...RESERVED_CHECK_ITEM_KEYS, ...readNonStringAlignKeys(element)],
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
        if (isLegacyText(element) || element.type !== LEGACY_CHECKBOX_ITEM_TYPE) {
            break;
        }

        const path = [index];
        const item = buildCheckItem(element, path, context);
        const level = Math.min(item.level, frames.length + 1);
        if (level > MAX_DEPTH) {
            return { status: 'limit-exceeded' };
        }

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

    return { status: 'mapped', blocks, nextIndex: index };
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
        case LEGACY_PARAGRAPH_TYPE:
            return mapTextBlock(element, { ...options, spec: { type: 'paragraph' } });
        case LEGACY_QUOTE_TYPE:
            return mapTextBlock(element, { ...options, spec: { type: 'quote' } });
        case LEGACY_BULLET_LIST_TYPE:
            return mapList(element, { ...options, listType: 'bulletList' });
        case LEGACY_NUMBERED_LIST_TYPE:
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

        return [keepWholeBlock(element, options.path, options.context)];
    }

    const blocks: OpenBlock[] = [node];
    if (startsNewColumn(element, options.position)) {
        blocks.push({ type: 'columnBreak' });
    }

    return blocks;
};

const mapTopLevel = (tree: LegacyRichTextTree, context: MappingContext): TopLevelMapping => {
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

        if (node.type === LEGACY_CHECKBOX_ITEM_TYPE) {
            const run = mapCheckRun(tree, index, context);
            if (run.status === 'limit-exceeded') {
                return run;
            }

            blocks.push(...run.blocks);
            index = run.nextIndex;
            continue;
        }

        blocks.push(...mapTopLevelBlock(node, { path: [index], position: 'topLevel', context }));
        index += 1;
    }

    return { status: 'mapped', blocks };
};

/** Maps a validated legacy tree to blocks of the open document, listing every place a human should look at. */
export const fromLegacyTree = (tree: LegacyRichTextTree, options: FromLegacyTreeOptions): FromLegacyTreeResult => {
    const context: MappingContext = {
        diagnostics: [],
        copyBudget: createCopyBudget(MAX_COPIED_VALUES),
        resolveMention: options.resolveMention,
    };
    const mapping = mapTopLevel(tree, context);
    if (mapping.status === 'limit-exceeded' || context.copyBudget.remaining < 0) {
        return { status: 'limit-exceeded' };
    }

    if (context.reservedTypePath !== undefined) {
        return { status: 'reserved-type', path: context.reservedTypePath };
    }

    return { status: 'mapped', blocks: mapping.blocks, diagnostics: context.diagnostics };
};
