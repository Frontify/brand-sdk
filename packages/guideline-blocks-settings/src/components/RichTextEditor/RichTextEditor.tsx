/* (c) Copyright Frontify Ltd., all rights reserved. */

import {
    type RtePlugin,
    type RteDocument,
    RichTextEditor as FondueRichTextEditor,
} from '@frontify/fondue/rich-text-editor';
import { columnBreakPlugin, defaultPlugins } from '@frontify/fondue/rich-text-editor/plugins';
import { memo, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';

import { useIsInViewport } from '../../hooks/useIsInViewport';

import { readRichTextValue, writeRichTextValue } from './richTextValue';
import { SerializedText } from './SerializedText';
import { type RichTextEditorProps } from './types';

const EDITOR_TEST_ID = 'rich-text-editor';
const PLUGIN_ID_SEPARATOR = ',';

const pluginIdsOf = (plugins: readonly RtePlugin[]): string => plugins.map(({ id }) => id).join(PLUGIN_ID_SEPARATOR);

/**
 * Blocks rebuild their plugins every render, and Fondue shows any document it was not handed back, so the
 * plugins (and the stored value read with them) change only with their ids, as Fondue's own rebuild does.
 */
const useKeptWhileKeyHolds = <TValue,>(value: TValue, key: string): TValue => {
    const keptRef = useRef({ key, value });
    if (keptRef.current.key !== key) {
        keptRef.current = { key, value };
    }

    return keptRef.current.value;
};

type InternalRichTextEditorProps = Omit<RichTextEditorProps, 'isEditing'> & { isEnabled: boolean };

const InternalRichTextEditor = memo(
    ({
        isEnabled,
        value,
        columns,
        gap,
        placeholder,
        plugins = defaultPlugins,
        onTextChange,
        showSerializedText,
        showToolbar = true,
    }: InternalRichTextEditorProps) => {
        const [shouldPreventPageLeave, setShouldPreventPageLeave] = useState(false);
        const editorId = useId();

        const editorPlugins = useMemo(() => {
            if (columns === undefined) {
                return plugins;
            }

            return [...plugins, columnBreakPlugin({ columns, gap })];
        }, [plugins, columns, gap]);

        const stablePlugins = useKeptWhileKeyHolds(editorPlugins, pluginIdsOf(editorPlugins));
        const stored = useMemo(() => readRichTextValue(value, stablePlugins), [value, stablePlugins]);

        const handleBlur = useCallback(
            (document: RteDocument) => {
                if (!shouldPreventPageLeave) {
                    return;
                }

                const written = writeRichTextValue(document, columns, value);

                switch (written.outcome) {
                    case 'written':
                        onTextChange?.(written.value);
                        setShouldPreventPageLeave(false);
                        return;
                    case 'unchanged':
                        setShouldPreventPageLeave(false);
                        return;
                    case 'not-reversible':
                        console.error(
                            'Rich text was not saved, it has no legacy form:',
                            written.diagnostics.map(({ code }) => code),
                        );
                        return;
                }
            },
            [columns, onTextChange, shouldPreventPageLeave, value],
        );

        const handleValueChange = useCallback(() => setShouldPreventPageLeave(true), []);

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

        if (isEnabled && stored.access === 'editable') {
            return (
                <FondueRichTextEditor
                    id={editorId}
                    value={stored.document}
                    placeholder={placeholder}
                    plugins={editorPlugins}
                    toolbarPlacement="floating"
                    showEditor={showToolbar}
                    onChange={handleValueChange}
                    onBlur={handleBlur}
                    data-test-id={EDITOR_TEST_ID}
                />
            );
        }

        return <SerializedText stored={stored} show={showSerializedText} plugins={editorPlugins} />;
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
            // oxlint-disable-next-line @eslint-react/set-state-in-effect
            setHasEnteredViewport(false);
        }
    }, [isEditing]);

    return (
        <div data-test-id="rich-text-editor-container" className="tw-block tw-w-full tw-@container" ref={ref}>
            <InternalRichTextEditor {...internalRteProps} isEnabled={isEditing && hasEnteredViewport} />
        </div>
    );
};
