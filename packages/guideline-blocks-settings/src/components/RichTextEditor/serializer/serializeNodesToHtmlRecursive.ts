/* (c) Copyright Frontify Ltd., all rights reserved. */

import {
    ELEMENT_CHECK_ITEM,
    LI_CLASSNAMES,
    MappedMentionableItems,
    OL_STYLES,
    UL_CLASSES,
    alignmentClassnames,
    getLiStyles,
    getLicElementClassNames,
    getOrderedListClasses,
    merge,
} from '@frontify/fondue';
import {
    ELEMENT_LI,
    ELEMENT_LIC,
    ELEMENT_LINK,
    ELEMENT_MENTION,
    ELEMENT_OL,
    ELEMENT_UL,
    TDescendant,
    TElement,
    isText,
} from '@udecode/plate';
import { serializeLeafToHtml } from './utlis/serializeLeafToHtml';
import { reactCssPropsToCss } from './utlis/reactCssPropsToCss';
import type { CSSProperties } from 'react';
import { ButtonStylesType, buttonNode } from './nodes/button';
import { linkNode } from './nodes/link';
import { defaultNode } from './nodes/default';
import { checkItemNode } from './nodes/checkItemNode';
import { mentionHtmlNode } from './nodes/mentionHtmlNode';
import { ELEMENT_BUTTON } from '../plugins';

const countNodesOfType = (nodes: TDescendant[], type: string): number => {
    return nodes.reduce((acc, node) => {
        if (node.type === type) {
            acc++;
        }
        if (node.children) {
            return acc + countNodesOfType(node.children as TDescendant[], type);
        }
        return acc;
    }, 0);
};

type NestingCount = {
    [type: string]: number;
};

type SerializeNodeToHtmlRecursiveOptions = {
    mappedMentionable?: MappedMentionableItems;
    nestingCount?: NestingCount;
};

export const serializeNodeToHtmlRecursive = (
    node: TDescendant,
    styles: Record<string, CSSProperties & { hover?: CSSProperties }> | ButtonStylesType,
    { mappedMentionable, nestingCount = {} }: SerializeNodeToHtmlRecursiveOptions,
): string => {
    if (isText(node)) {
        return serializeLeafToHtml(node);
    }

    const rootNestingCount = nestingCount[node.type] || countNodesOfType([node], node.type);
    let children = '';
    for (const element of node.children) {
        children += serializeNodeToHtmlRecursive(element, styles, {
            nestingCount: {
                ...nestingCount,
                [element.type as string]: rootNestingCount,
            },
            mappedMentionable,
        });
    }

    const htmlMapper = MapNodeTypesToHtml[node.type];
    if (typeof htmlMapper !== 'undefined') {
        return htmlMapper({
            classNames: getClassNames(node.breakAfterColumn as string | undefined, node.align as string | undefined),
            children,
            rootNestingCount,
            node,
            mappedMentionable,
            styles,
        });
    } else {
        return defaultNode(
            node,
            children,
            styles[node.type],
            getClassNames(node.breakAfterColumn as string | undefined, node.align as string | undefined),
        );
    }
};

type Arguments = {
    classNames: string;
    children: string;
    rootNestingCount: number;
    node: TElement;
    mappedMentionable?: MappedMentionableItems;
    styles: Record<string, CSSProperties & { hover?: CSSProperties }> | ButtonStylesType;
};

const MapNodeTypesToHtml: { [key: string]: ({ ...args }: Arguments) => string } = {
    [ELEMENT_UL]: (args) => `<ul dir="auto" class="${UL_CLASSES} ${args.classNames}">${args.children}</ul>`,
    [ELEMENT_OL]: ({ classNames, children, node, rootNestingCount }) => {
        const nestingLevel = Math.max(rootNestingCount - countNodesOfType([node], ELEMENT_OL), 0);
        return `<ol dir="auto" class="${getOrderedListClasses(nestingLevel)} ${classNames}" style="${reactCssPropsToCss(
            OL_STYLES,
        )}">${children}</ol>`;
    },
    [ELEMENT_LI]: ({ classNames, children, node, styles }) =>
        `<li dir="auto" class="${classNames} ${LI_CLASSNAMES}" style="${reactCssPropsToCss(
            getLiStyles(node, styles),
        )}">${children}</li>`,
    [ELEMENT_LIC]: ({ classNames, children, node }) =>
        `<p dir="auto" class="${classNames} ${getLicElementClassNames(node)}"><span>${children}</span></p>`,
    [ELEMENT_LINK]: ({ node, children, classNames, styles }) => linkNode(node, children, classNames, styles),
    [ELEMENT_BUTTON]: ({ node, children, classNames, styles }) =>
        buttonNode(node, children, classNames, styles as ButtonStylesType),
    [ELEMENT_CHECK_ITEM]: ({ node, children, classNames, styles }) => checkItemNode(node, children, classNames, styles),
    [ELEMENT_MENTION]: ({ node, mappedMentionable }) => mentionHtmlNode(node, { mentionable: mappedMentionable }),
};

const getClassNames = (breakAfterColumn?: string, align?: string) => {
    const breakWordsClass = 'tw-break-words';
    const columnBreakClasses =
        breakAfterColumn === 'active' ? 'tw-break-after-column tw-break-inside-avoid-column' : '';
    const alignClass = align ? alignmentClassnames[align] : '';
    return merge([alignClass, breakWordsClass, columnBreakClasses]);
};
