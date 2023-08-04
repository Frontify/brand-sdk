/* (c) Copyright Frontify Ltd., all rights reserved. */

import { TDescendant } from '@udecode/plate';
import { PluginComposer, SerializeNodesToHtmlOptions, mapMentionable, parseRawValue } from '@frontify/fondue';
import { BlockStyles } from '../plugins';
import { serializeNodeToHtmlRecursive } from './serializeNodesToHtmlRecursive';

export const serializeRawToHtmlAsync = async (
    raw: string,
    columns: SerializeNodesToHtmlOptions['columns'] = 1,
    columnGap: SerializeNodesToHtmlOptions['columnGap'] = 'normal',
    plugins: PluginComposer = new PluginComposer(),
): Promise<string> => {
    const nodes = parseRawValue({ raw, plugins });
    const styles = plugins.getStyles;
    return Promise.resolve(serializeNodesToHtml(nodes, { columns, columnGap, styles }));
};

export const serializeNodesToHtml = (
    nodes: TDescendant[],
    { mentionable, columns = 1, columnGap = 'normal', styles = BlockStyles }: SerializeNodesToHtmlOptions = {},
): string => {
    const mappedMentionable = mentionable ? mapMentionable(mentionable) : new Map();

    let html = '';
    for (let i = 0, len = nodes.length; i < len; i++) {
        const node = nodes[i];
        if (isEmptyNode(node)) {
            html += '<br />';
        } else {
            html += serializeNodeToHtmlRecursive(node, styles, {
                mappedMentionable,
            });
        }
    }

    if (columns > 1) {
        return `<div style="columns:${columns}; column-gap:${columnGap};">${html}</div>`;
    }

    return html;
};

const isEmptyNode = (node: TDescendant): boolean => {
    if (!Array.isArray(node?.children)) {
        return false;
    }
    return node?.children?.every((child) => child.text === '');
};
