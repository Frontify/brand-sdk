/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useCallback, useSyncExternalStore } from 'react';

import { type AppBridgeBlock } from '../AppBridgeBlock';

// Fallback for hosts that don't publish `isEditing`: they toggle the `editor-enabled` class on `<body>`
const observeBodyClass = (onChange: () => void): (() => void) => {
    const mutationObserver = new MutationObserver((mutationsList) => {
        if (mutationsList.some((mutation) => mutation.attributeName === 'class')) {
            onChange();
        }
    });
    mutationObserver.observe(document.body, { attributes: true });

    return () => mutationObserver.disconnect();
};

export const useEditorState = (appBridge: AppBridgeBlock): boolean => {
    const subscribe = useCallback(
        (onChange: () => void) => {
            const editorStateContext = appBridge.context('isEditing');

            // Hosts that publish the editor state notify every block from one source, without a DOM observer per block
            if (typeof editorStateContext.get() === 'boolean') {
                return editorStateContext.subscribe(onChange);
            }

            return observeBodyClass(onChange);
        },
        [appBridge],
    );

    const getEditorState = useCallback(
        () => appBridge.context('isEditing').get() ?? appBridge.getEditorState(),
        [appBridge],
    );

    return useSyncExternalStore(subscribe, getEditorState);
};
