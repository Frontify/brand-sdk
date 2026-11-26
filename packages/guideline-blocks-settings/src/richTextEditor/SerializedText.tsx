/* (c) Copyright Frontify Ltd., all rights reserved. */

import { RichTextRenderer, isEmpty } from '@frontify/fondue/rich-text-editor';

import { type SerializedTextProps } from './types';

export const SerializedText = ({ stored, show = true, plugins }: SerializedTextProps) => {
    if (stored.access === 'unreadable' || !show || isEmpty(stored.document)) {
        return null;
    }

    return (
        <div className="tw-w-full tw-whitespace-pre-wrap" data-test-id="rte-content-html">
            <RichTextRenderer plugins={plugins} value={stored.document} />
        </div>
    );
};
