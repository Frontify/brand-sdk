/* (c) Copyright Frontify Ltd., all rights reserved. */

import {
    type RichTextEditorProps as FondueRichTextEditorProps,
    type RtePlugin,
} from '@frontify/fondue/rich-text-editor';
import { type ColumnBreakPluginOptions } from '@frontify/fondue/rich-text-editor/plugins';

import { type StoredRichText } from './richTextValue';

export type RichTextEditorProps = {
    isEditing: boolean;
    /** Legacy Slate JSON, as stored. */
    value?: string;
    placeholder?: FondueRichTextEditorProps['placeholder'];
    /** Lays the content out in columns and adds Fondue's `columnBreakPlugin`: do not add it to `plugins` too. */
    columns?: ColumnBreakPluginOptions['columns'];
    /** The gap between the columns. Takes effect with `columns`. */
    gap?: ColumnBreakPluginOptions['gap'];
    /**
     * The plugins the editor mounts.
     * @default defaultPlugins
     */
    plugins?: readonly RtePlugin[];
    showSerializedText?: boolean;
    /**
     * Draw the toolbar and the `/` menu. Off, the editor keeps every plugin's keys and typing rules.
     * @default true
     */
    showToolbar?: boolean;
    /** Called with the new value as legacy Slate JSON. */
    onTextChange?: (value: string) => void;
};

export type SerializedTextProps = {
    stored: StoredRichText;
    show?: boolean;
    plugins: readonly RtePlugin[];
};
