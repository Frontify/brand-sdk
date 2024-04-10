/* (c) Copyright Frontify Ltd., all rights reserved. */

import { produce } from 'immer';
import debounce from 'lodash-es/debounce';
import { useCallback, useEffect, useState } from 'react';
import { type AppBridgeTheme } from 'src/AppBridgeTheme';
import { type EmitterEvents } from 'src/types/Emitter';
import { type NavigationTreeClassTypes, type NavigationTree } from 'src/types/NavigationTree';

type Options = {
    /**
     * Whether it should fetch on mount.
     */
    enabled?: boolean;
};

export const usePortalNavigation = (appBridge: AppBridgeTheme, options: Options = { enabled: true }) => {
    const [navigationItems, setNavigationItems] = useState<NavigationTree>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const refetch = useCallback(async () => {
        setIsLoading(true);
        setNavigationItems(await appBridge.getPortalNavigation());
        setIsLoading(false);
    }, [appBridge]);

    useEffect(() => {
        if (options.enabled) {
            refetch();
        }
    }, [options.enabled, refetch]);

    useEffect(() => {
        const handleCoverPageAction = (event: EmitterEvents['AppBridge:GuidelineCoverPage:Action']) => {
            switch (event.action) {
                case 'delete':
                    setNavigationItems(
                        produce((draft) => {
                            const itemDraftIndex = draft.findIndex((item) => item.type === 'cover-page');
                            if (itemDraftIndex !== -1) {
                                draft.splice(itemDraftIndex, 1);
                            }
                        }),
                    );
                    break;

                case 'update':
                case 'add':
                // do nothing
            }

            debounce(refetch, 100);
        };

        const handleDocumentGroupAction = (event: EmitterEvents['AppBridge:GuidelineDocumentGroup:Action']) => {
            switch (event.action) {
                case 'delete':
                    setNavigationItems(
                        produce((draft) => {
                            const itemDraftIndex = draft.findIndex(
                                (item) => item.type === 'document-group' && item.id() === event.documentGroup.id,
                            );
                            if (itemDraftIndex !== -1) {
                                draft.splice(itemDraftIndex, 1);
                            }
                            return draft;
                        }),
                    );
                    break;

                case 'update':
                case 'add':
                // do nothing
            }

            debounce(refetch, 100);
        };

        const handleDocumentAction = (event: EmitterEvents['AppBridge:GuidelineDocument:Action']) => {
            switch (event.action) {
                case 'delete':
                    setNavigationItems(
                        produce((draft) => {
                            if (!event.document.documentGroupId) {
                                const itemDraftIndex = draft.findIndex(
                                    (item) => item.type === 'document' && item.id() === event.document.id,
                                );
                                if (itemDraftIndex !== -1) {
                                    draft.splice(itemDraftIndex, 1);
                                }
                            }
                            return draft;
                        }),
                    );
                    break;

                case 'update':
                case 'add':
                // do nothing
            }

            debounce(refetch, 100);
        };

        const handlerDocumentGroupMoveEventPreview = (
            event: EmitterEvents['AppBridge:GuidelineDocumentGroup:MoveEvent'],
        ) => {
            setNavigationItems(
                produce((draft) => previewItemPosition(draft, event.documentGroup, event.position, ['document-group'])),
            );
        };

        const handleDocumentMoveEventPreview = (event: EmitterEvents['AppBridge:GuidelineDocument:MoveEvent']) => {
            if (!event.document.documentGroupId && !event.newGroupId) {
                setNavigationItems(
                    produce((draft) =>
                        previewItemPosition(draft, event.document, event.position, [
                            'document',
                            'document-library',
                            'document-link',
                        ]),
                    ),
                );
            }
        };

        window.emitter.on('AppBridge:GuidelineCoverPage:Action', handleCoverPageAction);

        window.emitter.on('AppBridge:GuidelineDocumentGroup:Action', handleDocumentGroupAction);
        window.emitter.on('AppBridge:GuidelineDocumentGroup:MoveEvent', handlerDocumentGroupMoveEventPreview);

        window.emitter.on('AppBridge:GuidelineDocument:Action', handleDocumentAction);
        window.emitter.on('AppBridge:GuidelineDocument:MoveEvent', handleDocumentMoveEventPreview);
        window.emitter.on('AppBridge:GuidelineDocumentTargets:Action', refetch);

        return () => {
            window.emitter.off('AppBridge:GuidelineCoverPage:Action', handleCoverPageAction);

            window.emitter.off('AppBridge:GuidelineDocumentGroup:Action', handleDocumentGroupAction);
            window.emitter.off('AppBridge:GuidelineDocumentGroup:MoveEvent', handlerDocumentGroupMoveEventPreview);

            window.emitter.off('AppBridge:GuidelineDocument:Action', handleDocumentAction);
            window.emitter.off('AppBridge:GuidelineDocument:MoveEvent', handleDocumentMoveEventPreview);
            window.emitter.off('AppBridge:GuidelineDocumentTargets:Action', refetch);
        };
    }, [navigationItems, refetch]);

    return { navigationItems, refetch, isLoading };
};

const previewItemPosition = (
    draft: NavigationTree,
    itemMoved:
        | EmitterEvents['AppBridge:GuidelineDocument:MoveEvent']['document']
        | EmitterEvents['AppBridge:GuidelineDocumentGroup:MoveEvent']['documentGroup'],
    newPosition: number,
    allowedTypes: NavigationTreeClassTypes[],
) => {
    const itemDraftIndex = draft.findIndex((item) => allowedTypes.includes(item.type) && item.id() === itemMoved.id);

    if (itemDraftIndex !== -1) {
        const itemToMove = draft.splice(itemDraftIndex, 1);
        draft.splice(newPosition, 0, ...itemToMove);
    }

    return draft;
};
