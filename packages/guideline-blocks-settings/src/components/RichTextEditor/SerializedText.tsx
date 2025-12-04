/* (c) Copyright Frontify Ltd., all rights reserved. */

import { serializeRawToHtmlAsync } from '@frontify/fondue';
import { useCallback, useEffect, useState } from 'react';

import { type SerializedTextProps } from './types';

export const SerializedText = ({ value = '', gap, customClass, show = true, plugins }: SerializedTextProps) => {
    const [html, setHtml] = useState<string | null>(null);

    // eslint-disable-next-line @eslint-react/no-unnecessary-use-callback
    const updateHtml = useCallback(async () => {
        const htmlContent = await serializeRawToHtmlAsync(value, plugins, undefined, gap, customClass);
        setHtml(htmlContent);
    }, [value, gap, plugins, customClass]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        updateHtml().catch(console.error);
    }, [updateHtml]);

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
