/* (c) Copyright Frontify Ltd., all rights reserved. */

import {
    type RichTextEditorProps as FondueRichTextEditorProps,
    type RteDocument,
    type RtePlugin,
    RichTextEditor as FondueRichTextEditor,
} from '@frontify/fondue/rich-text-editor';
import { columnBreakPlugin, defaultPlugins } from '@frontify/fondue/rich-text-editor/plugins';
import { memo, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';

import { useIsInViewport } from '../hooks/useIsInViewport';

import { type StoredRichText, readRichTextValue, writeRichTextValue } from './richTextValue';
import { SerializedText } from './SerializedText';
import { type RichTextEditorProps } from './types';

const EDITOR_TEST_ID = 'rich-text-editor';
const PLUGIN_ID_SEPARATOR = ',';
const UNSAVED_MESSAGE =
    'This text has content that cannot be saved yet, such as an in-progress to-do item. Remove it to save your changes.';

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

type EditableRichTextProps = Pick<RichTextEditorProps, 'value' | 'columns' | 'placeholder' | 'onTextChange'> & {
    document: RteDocument;
    plugins: readonly RtePlugin[];
    showToolbar: boolean;
};

/**
 * The live editor. It holds the editing state, so leaving edit mode unmounts it and drops the unsaved flags.
 */
const EditableRichText = ({
    value,
    document: storedDocument,
    columns,
    placeholder,
    plugins,
    showToolbar,
    onTextChange,
}: EditableRichTextProps) => {
    const [editorDocument, setEditorDocument] = useState(storedDocument);
    const [renderedValue, setRenderedValue] = useState(value);
    // What this editor sent that the parent has not handed back yet, oldest first.
    const [sentValues, setSentValues] = useState<string[]>([]);
    const [shouldPreventPageLeave, setShouldPreventPageLeave] = useState(false);
    const [isUnsaved, setIsUnsaved] = useState(false);
    const editorId = useId();
    const messageId = useId();

    if (renderedValue !== value) {
        setRenderedValue(value);

        let echoIndex = -1;
        if (value !== undefined) {
            echoIndex = sentValues.indexOf(value);
        }

        if (echoIndex === -1) {
            // Fondue shows any document it was not handed back, so only a value from elsewhere replaces its own.
            setEditorDocument(storedDocument);
            setSentValues([]);
            setShouldPreventPageLeave(false);
            setIsUnsaved(false);
        } else {
            setSentValues(sentValues.slice(echoIndex + 1));
        }
    }

    const handleBlur = (document: RteDocument) => {
        if (!shouldPreventPageLeave) {
            return;
        }

        let previous = value;
        if (sentValues.length > 0) {
            previous = sentValues[sentValues.length - 1];
        }

        const written = writeRichTextValue(document, columns, previous, plugins);

        switch (written.outcome) {
            case 'written':
                setSentValues([...sentValues, written.value]);
                onTextChange?.(written.value);
                setShouldPreventPageLeave(false);
                setIsUnsaved(false);
                return;
            case 'unchanged':
                setShouldPreventPageLeave(false);
                setIsUnsaved(false);
                return;
            case 'not-reversible':
                setIsUnsaved(true);
                return;
        }
    };

    const handleValueChange = (document: RteDocument) => {
        setEditorDocument(document);
        setShouldPreventPageLeave(true);
    };

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

    let status: FondueRichTextEditorProps['status'] = 'neutral';
    if (isUnsaved) {
        status = 'error';
    }

    return (
        <>
            <FondueRichTextEditor
                id={editorId}
                value={editorDocument}
                placeholder={placeholder}
                plugins={plugins}
                toolbarPlacement="floating"
                status={status}
                showEditor={showToolbar}
                onChange={handleValueChange}
                onBlur={handleBlur}
                aria-errormessage={messageId}
                data-test-id={EDITOR_TEST_ID}
            />
            {isUnsaved ? (
                <p id={messageId} className="tw-text-error tw-mt-1 tw-text-small">
                    {UNSAVED_MESSAGE}
                </p>
            ) : null}
        </>
    );
};

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
        const editorPlugins = useMemo(() => {
            if (columns === undefined) {
                return plugins;
            }

            return [...plugins, columnBreakPlugin({ columns, gap })];
        }, [plugins, columns, gap]);

        const stablePlugins = useKeptWhileKeyHolds(editorPlugins, pluginIdsOf(editorPlugins));
        const stored = useMemo((): StoredRichText => readRichTextValue(value, stablePlugins), [value, stablePlugins]);

        if (isEnabled && stored.access === 'editable') {
            return (
                <EditableRichText
                    value={value}
                    document={stored.document}
                    columns={columns}
                    placeholder={placeholder}
                    plugins={editorPlugins}
                    showToolbar={showToolbar}
                    onTextChange={onTextChange}
                />
            );
        }

        // Editing always showed the content; the flag only governs the view outside editing.
        let show = showSerializedText;
        if (isEnabled) {
            show = true;
        }

        return <SerializedText stored={stored} show={show} plugins={editorPlugins} />;
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
