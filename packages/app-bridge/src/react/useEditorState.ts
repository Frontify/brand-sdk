/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';

import { type AppBridgeBlock } from '../AppBridgeBlock';

export const useEditorState = (appBridge: AppBridgeBlock): boolean => {
    const [editorState, setEditorState] = useState(
        () => appBridge.context('isEditing').get() ?? appBridge.getEditorState(),
    );

    useEffect(() => {
        const editorStateContext = appBridge.context('isEditing');
        const hostEditorState = editorStateContext.get();

        // Hosts that publish the editor state notify all blocks once, without a DOM observer per block
        if (typeof hostEditorState === 'boolean') {
            setEditorState(hostEditorState);
            return editorStateContext.subscribe((nextEditorState) => {
                setEditorState(nextEditorState ?? appBridge.getEditorState());
            });
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
    }, [appBridge]);

    return editorState;
};
