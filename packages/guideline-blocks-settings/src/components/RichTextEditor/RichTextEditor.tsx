/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useCallback, useEffect, useState } from 'react';

import { RichTextEditor as FondueRichTextEditor } from '@frontify/fondue';
import { RichTextEditorProps } from './types';
import { SerializedText } from './SerializedText';
import { floatingButtonActions, floatingButtonSelectors } from './plugins/ButtonPlugin/components';

export const RichTextEditor = ({
    id = 'rte',
    isEditing,
    value,
    columns,
    gap,
    placeholder,
    plugins,
    onTextChange,
    showSerializedText,
}: RichTextEditorProps) => {
    const [shouldPreventPageLeave, setShouldPreventPageLeave] = useState(false);

    const handleTextChange = useCallback(
        (newContent: string) => {
            if (onTextChange && newContent !== value) {
                onTextChange(newContent);
            }
            setShouldPreventPageLeave(false);
        },
        [onTextChange, value],
    );

    const handleValueChange = useCallback(() => setShouldPreventPageLeave(true), []);

    const handleHideExternalFloatingModals = useCallback((editorId: string) => {
        if (floatingButtonSelectors.isOpen(editorId)) {
            floatingButtonActions.reset();
        }
    }, []);

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
                plugins={plugins}
                onValueChanged={handleValueChange}
                onTextChange={handleTextChange}
                hideExternalFloatingModals={handleHideExternalFloatingModals}
            />
        );
    }
    return <SerializedText value={value} columns={columns} gap={gap} show={showSerializedText} plugins={plugins} />;
};
