/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type PluginComposer } from '@frontify/fondue/rte';

export type RichTextEditorProps = {
    isEditing: boolean;
    value?: string;
    placeholder?: string;
    columns?: number;
    gap?: string;
    plugins?: PluginComposer;
    showSerializedText?: boolean;
    onTextChange?: (value: string) => void;
};

export type SerializedTextProps = {
    value?: string;
    show?: boolean;
    gap?: string;
    customClass?: string;
    plugins?: PluginComposer;
};
