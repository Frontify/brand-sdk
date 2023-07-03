/* (c) Copyright Frontify Ltd., all rights reserved. */

import { PluginComposer, TreeOfNodes } from '@frontify/fondue';

export type RichTextEditorProps = {
    id?: string;
    isEditing: boolean;
    value?: string;
    placeholder?: string;
    columns?: number;
    gap?: string;
    plugins?: PluginComposer;
    updateValueOnChange?: boolean;
    showSerializedText?: boolean;
    shouldPreventPageLeave?: boolean;
    onBlur?: (value: string) => void;
    onTextChange?: (value: string) => void;
    onValueChanged?: (value: TreeOfNodes | null) => void;
};

export type SerializedTextProps = {
    value?: string;
    show?: boolean;
    columns?: number;
    gap?: string;
    plugins?: PluginComposer;
};
