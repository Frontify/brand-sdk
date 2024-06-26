/* (c) Copyright Frontify Ltd., all rights reserved. */

import { serializeRawToHtmlAsync } from '@frontify/fondue';
import { useEffect, useState } from 'react';

import { type SerializedTextProps } from './types';

export const SerializedText = ({ value = '', gap, customClass, show = true, plugins }: SerializedTextProps) => {
    const [html, setHtml] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            setHtml(await serializeRawToHtmlAsync(value, plugins, undefined, gap, customClass));
        })();
    }, [value, gap, plugins, customClass]);

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
