/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useState } from 'react';

import type { AppBridgeBlock } from '../AppBridgeBlock';
import type { AppBridgeTheme } from '../AppBridgeTheme';

export const useEditorState = (appBridge: AppBridgeBlock | AppBridgeTheme): boolean => {
    const [editorState, setEditorState] = useState(appBridge.getEditorState());

    useEffect(() => {
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
    }, []);

    return editorState;
};
