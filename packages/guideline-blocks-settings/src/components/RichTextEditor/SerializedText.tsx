/* (c) Copyright Frontify Ltd., all rights reserved. */

import { serializeRawToHtmlAsync } from '@frontify/fondue/rte';
import { useEffect, useState } from 'react';

import { type SerializedTextProps } from './types';

export const SerializedText = ({ value = '', gap, customClass, show = true, plugins }: SerializedTextProps) => {
    const [html, setHtml] = useState<string | null>(null);

    useEffect(() => {
        const updateHtml = async () => {
            const htmlContent = await serializeRawToHtmlAsync(value, plugins, undefined, gap, customClass);
            setHtml(htmlContent);
        };
        updateHtml().catch(console.error);
    }, [value, gap, plugins, customClass]);

    if (!show || html === '<br />' || html === null) {
        return null;
    }

    return (
        <div
            className="tw-w-full tw-whitespace-pre-wrap"
            data-test-id="rte-content-html"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
};
