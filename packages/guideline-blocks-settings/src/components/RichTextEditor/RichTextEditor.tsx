/* (c) Copyright Frontify Ltd., all rights reserved. */

import { memo, useCallback, useEffect, useRef, useState } from 'react';

import { RichTextEditor as FondueRichTextEditor } from '@frontify/fondue';
import { RichTextEditorProps } from './types';
import { SerializedText } from './SerializedText';
import { floatingButtonActions, floatingButtonSelectors } from './plugins/ButtonPlugin/components';
import { useIsInViewport } from '../../hooks/useIsInViewport';

const InternalRichTextEditor = memo(
    ({
        id = 'rte',
        isEnabled,
        value,
        columns,
        gap,
        placeholder,
        plugins,
        onTextChange,
        showSerializedText,
    }: Omit<RichTextEditorProps, 'isEditing'> & { isEnabled: boolean }) => {
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

        if (isEnabled) {
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
    },
);
InternalRichTextEditor.displayName = 'InternalRichTextEditor';

export const RichTextEditor = (props: RichTextEditorProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [hasEnteredViewport, setHasEnteredViewport] = useState(false);

    const { isEditing, ...internalRteProps } = props;

    const onViewportVisibilityChange = useCallback((isInViewport: boolean) => {
        if (isInViewport) {
            setHasEnteredViewport(true);
        }
    }, []);

    useIsInViewport({ ref, disabled: !isEditing, onChange: onViewportVisibilityChange });

    useEffect(() => {
        setHasEnteredViewport(false);
    }, []);

    return (
        <div className="tw-block tw-w-full" ref={ref}>
            <InternalRichTextEditor {...internalRteProps} isEnabled={isEditing && hasEnteredViewport} />
        </div>
    );
};
