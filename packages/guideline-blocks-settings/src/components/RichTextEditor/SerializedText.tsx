/* (c) Copyright Frontify Ltd., all rights reserved. */

import { RichTextRenderer, isEmpty } from '@frontify/fondue/rich-text-editor';
import { columnBreakContent, defaultPlugins } from '@frontify/fondue/rich-text-editor/plugins';
import { useMemo } from 'react';

import { readRichTextValue } from './richTextValue';
import { type SerializedTextProps } from './types';

export const SerializedText = ({ value, show = true, columns, gap, plugins = defaultPlugins }: SerializedTextProps) => {
    const rendererPlugins = useMemo(() => {
        if (columns === undefined) {
            return plugins;
        }

        return [...plugins, columnBreakContent({ columns, gap })];
    }, [plugins, columns, gap]);

    const stored = useMemo(() => readRichTextValue(value, plugins), [value, plugins]);

    if (stored.access === 'unreadable' || !show || isEmpty(stored.document)) {
        return null;
    }

    return (
        <div className="tw-w-full tw-whitespace-pre-wrap" data-test-id="rte-content-html">
            <RichTextRenderer plugins={rendererPlugins} value={stored.document} />
        </div>
    );
};
