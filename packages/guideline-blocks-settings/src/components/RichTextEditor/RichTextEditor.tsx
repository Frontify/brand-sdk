/* (c) Copyright Frontify Ltd., all rights reserved. */

import { RichTextEditor as FondueRichTextEditor } from '@frontify/fondue';
import { memo, useCallback, useEffect, useId, useRef, useState } from 'react';

import { useIsInViewport } from '../../hooks/useIsInViewport';

import { SerializedText } from './SerializedText';
import { floatingButtonActions, floatingButtonSelectors } from './plugins/ButtonPlugin/components';
import { getResponsiveColumnClasses } from './plugins/ColumnBreakPlugin/helpers';
import { type RichTextEditorProps } from './types';

const InternalRichTextEditor = memo(
    ({
        isEnabled,
        value,
        columns,
        gap,
        placeholder,
        plugins,
        onTextChange,
        showSerializedText,
    }: Omit<RichTextEditorProps, 'isEditing'> & { isEnabled: boolean }) => {
        const customClass = getResponsiveColumnClasses(columns);
        const [shouldPreventPageLeave, setShouldPreventPageLeave] = useState(false);
        const editorId = useId();

        const handleTextChange = useCallback(
            (newContent: string) => {
                if (newContent !== value) {
                    onTextChange?.(newContent);
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
                event.returnValue = 'Unprocessed changes';
            };

            if (shouldPreventPageLeave) {
                window.addEventListener('beforeunload', unloadHandler);
            }

            return () => window.removeEventListener('beforeunload', unloadHandler);
        }, [shouldPreventPageLeave]);

        if (isEnabled) {
            return (
                <FondueRichTextEditor
                    id={editorId}
                    value={value}
                    border={false}
                    placeholder={placeholder}
                    plugins={plugins}
                    onValueChanged={handleValueChange}
                    onTextChange={handleTextChange}
                    hideExternalFloatingModals={handleHideExternalFloatingModals}
                    placeholderOpacity="high"
                />
            );
        }
        return (
            <SerializedText
                value={value}
                gap={gap}
                customClass={customClass}
                show={showSerializedText}
                plugins={plugins}
            />
        );
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
        if (!isEditing) {
            setHasEnteredViewport(false);
        }
    }, [isEditing]);

    return (
        <div data-test-id="rich-text-editor-container" className="tw-block tw-w-full tw-@container" ref={ref}>
            <InternalRichTextEditor {...internalRteProps} isEnabled={isEditing && hasEnteredViewport} />
        </div>
    );
};
