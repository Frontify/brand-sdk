/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';
import { serializeRawToHtmlAsync } from '@frontify/fondue';
import { SerializedTextProps } from './types';

export const SerializedText = ({ value = '', gap, columns, show = true, plugins }: SerializedTextProps) => {
    const [html, setHtml] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            setHtml(await serializeRawToHtmlAsync(value, plugins, columns, gap));
        })();
    }, [value, columns, gap, plugins]);

    if (!show || html === '<br />') {
        return null;
    }

    return html !== null ? (
        <div
            className="tw-w-full tw-whitespace-pre-wrap"
            data-test-id="rte-content-html"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    ) : (
        <div className="tw-rounded-sm tw-bg-base-alt tw-animate-pulse tw-h-full tw-min-h-[10px] tw-w-full" />
    );
};
