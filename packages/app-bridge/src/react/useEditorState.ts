/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';

import { type AppBridgeBlock } from '../AppBridgeBlock';

export const useEditorState = (appBridge: AppBridgeBlock): boolean => {
    // Same as `useIsEditing` in app-bridge-theme: hosts that publish the editor state notify every block from one source
    const editorStateContext = useMemo(() => appBridge.context('isEditing'), [appBridge]);
    const hostEditorState = useSyncExternalStore(editorStateContext.subscribe, editorStateContext.get);

    const [editorState, setEditorState] = useState(appBridge.getEditorState());

    useEffect(() => {
        // Hosts that don't publish it: observe the `editor-enabled` class on `<body>`
        if (hostEditorState !== undefined) {
            return;
        }

        const setFromEvent = () => setEditorState(appBridge.getEditorState());

        const mutationObserver = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.attributeName === 'class') {
                    setFromEvent();
                }
            }
        });

        mutationObserver.observe(document.body, { attributes: true });

        return () => {
            mutationObserver.disconnect();
        };
        // oxlint-disable-next-line @eslint-react/exhaustive-deps
    }, []);

    return hostEditorState ?? editorState;
};
