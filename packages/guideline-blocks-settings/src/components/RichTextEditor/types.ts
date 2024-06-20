/* (c) Copyright Frontify Ltd., all rights reserved. */

import { type PluginComposer } from '@frontify/fondue';

export type RichTextEditorProps = {
    id?: string;
    isEditing: boolean;
    value?: string;
    placeholder?: string;
    columns?: number;
    customClass?: string;
    gap?: string;
    plugins?: PluginComposer;
    showSerializedText?: boolean;
    onTextChange?: (value: string) => void;
};

export type SerializedTextProps = {
    value?: string;
    show?: boolean;
    columns?: number;
    gap?: string;
    customClass?: string;
    plugins?: PluginComposer;
};
