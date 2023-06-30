/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect } from 'react';

import { RichTextEditor as FondueRichTextEditor } from '@frontify/fondue';
import { RichTextEditorProps } from './types';
import { SerializedText } from './SerializedText';

export const RichTextEditor = ({
    id = 'rte',
    isEditing,
    value,
    columns,
    gap,
    placeholder,
    plugins,
    onBlur,
    onTextChange,
    onValueChanged,
    updateValueOnChange,
    showSerializedText,
    shouldPreventPageLeave,
}: RichTextEditorProps) => {
    useEffect(() => {
        const unloadHandler = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            return (event.returnValue = 'Unprocessed changes');
        };

        if (shouldPreventPageLeave) {
            window.addEventListener('beforeunload', unloadHandler);
        }

        return () => window.removeEventListener('beforeunload', unloadHandler);
    }, [shouldPreventPageLeave]);

    if (isEditing) {
        return (
            <FondueRichTextEditor
                id={id}
                value={value}
                border={false}
                placeholder={placeholder}
                onBlur={onBlur}
                plugins={plugins}
                onTextChange={onTextChange}
                onValueChanged={onValueChanged}
                updateValueOnChange={updateValueOnChange}
            />
        );
    }
    return <SerializedText value={value} columns={columns} gap={gap} show={showSerializedText} plugins={plugins} />;
};
