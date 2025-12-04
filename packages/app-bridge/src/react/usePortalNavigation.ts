/* (c) Copyright Frontify Ltd., all rights reserved. */

import { produce } from 'immer';
import debounce from 'lodash-es/debounce';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { type AppBridgeTheme } from '../AppBridgeTheme';
import { type EmitterEvents } from '../types/Emitter';
import { type PortalNavigationItem } from '../types/Guideline';

type Options = {
    /**
     * Whether it should fetch on mount.
     */
    enabled?: boolean;
};

export const usePortalNavigation = (appBridge: AppBridgeTheme, options: Options = { enabled: true }) => {
    const [navigationItems, setNavigationItems] = useState<PortalNavigationItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const refetch = useCallback(async () => {
        setIsLoading(true);
        setNavigationItems(await appBridge.api({ name: 'getPortalNavigation' }));
        setIsLoading(false);
    }, [appBridge]);

    // eslint-disable-next-line @eslint-react/no-unnecessary-use-memo
    const debouncedRefetch = useMemo(
        () =>
            debounce(() => {
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                refetch();
            }, 100),
        [refetch],
    );

    useEffect(() => {
        if (options.enabled) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises, react-hooks/set-state-in-effect
            refetch();
        }
    }, [options.enabled, refetch]);

    useEffect(() => {
        const handleCoverPageAction = (event: EmitterEvents['AppBridge:GuidelineCoverPage:Action']) => {
            if (event.action === 'delete') {
                setNavigationItems(
                    produce((draft) => {
                        return deleteItem(draft, 'cover-page', null);
                    }),
                );
            }

            debouncedRefetch();
        };

        const handleDocumentGroupAction = (event: EmitterEvents['AppBridge:GuidelineDocumentGroup:Action']) => {
            if (event.action === 'delete') {
                setNavigationItems(
                    produce((draft) => {
                        return deleteItem(draft, 'document-group', event.documentGroup.id);
                    }),
                );
            }

            debouncedRefetch();
        };

        const handleDocumentAction = (event: EmitterEvents['AppBridge:GuidelineDocument:Action']) => {
            if (event.action === 'delete') {
                setNavigationItems(
                    produce((draft) => {
                        if (!event.document.documentGroupId) {
                            return deleteItem(draft, 'document', event.document.id);
                        }
                        return draft;
                    }),
                );
            }

            debouncedRefetch();
        };

        const handleDocumentGroupMoveEventPreview = (
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
        window.emitter.on('AppBridge:GuidelineDocumentGroup:MoveEvent', handleDocumentGroupMoveEventPreview);

        window.emitter.on('AppBridge:GuidelineDocument:Action', handleDocumentAction);
        window.emitter.on('AppBridge:GuidelineDocument:MoveEvent', handleDocumentMoveEventPreview);
        window.emitter.on('AppBridge:GuidelineDocumentTargets:Action', debouncedRefetch);

        return () => {
            window.emitter.off('AppBridge:GuidelineCoverPage:Action', handleCoverPageAction);

            window.emitter.off('AppBridge:GuidelineDocumentGroup:Action', handleDocumentGroupAction);
            window.emitter.off('AppBridge:GuidelineDocumentGroup:MoveEvent', handleDocumentGroupMoveEventPreview);

            window.emitter.off('AppBridge:GuidelineDocument:Action', handleDocumentAction);
            window.emitter.off('AppBridge:GuidelineDocument:MoveEvent', handleDocumentMoveEventPreview);
            window.emitter.off('AppBridge:GuidelineDocumentTargets:Action', debouncedRefetch);
        };
    }, [navigationItems, debouncedRefetch]);

    return { navigationItems, refetch, isLoading };
};

const deleteItem = (draft: PortalNavigationItem[], type: PortalNavigationItem['type'], itemId: Nullable<number>) => {
    const itemDraftIndex = draft.findIndex((item) =>
        !itemId ? item.type === type : item.type === type && item.id() === itemId,
    );

    if (itemDraftIndex !== -1) {
        draft.splice(itemDraftIndex, 1);
    }

    return draft;
};

const previewItemPosition = (
    draft: PortalNavigationItem[],
    itemMoved:
        | EmitterEvents['AppBridge:GuidelineDocument:MoveEvent']['document']
        | EmitterEvents['AppBridge:GuidelineDocumentGroup:MoveEvent']['documentGroup'],
    newPosition: number,
    allowedTypes: PortalNavigationItem['type'][],
) => {
    const itemDraftIndex = draft.findIndex((item) => allowedTypes.includes(item.type) && item.id() === itemMoved.id);

    if (itemDraftIndex !== -1) {
        const itemToMove = draft.splice(itemDraftIndex, 1);
        draft.splice(newPosition, 0, ...itemToMove);
    }

    return draft;
};
