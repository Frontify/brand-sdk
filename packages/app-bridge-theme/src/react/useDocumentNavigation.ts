/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect, useSyncExternalStore } from 'react';

import { type AppBridgeTheme } from '../AppBridgeTheme.ts';
import { hydrateContextDocumentNavigation } from '../registries/commands/HydrateContextDocumentNavigation';
import {
    type Document,
    type DocumentNavigationItem,
    type DocumentChildNavigationItem,
    type PortalNavigationItem,
} from '../types/Guideline';

export const useDocumentNavigation = (appBridge: AppBridgeTheme, document: DocumentNavigationItem | Document) => {
    const portalNavigation: Readonly<PortalNavigationItem[] | null> = useSyncExternalStore(
        appBridge.context('portalNavigation').subscribe,
        appBridge.context('portalNavigation').get,
    );

    const documentNavigation: Record<number, DocumentChildNavigationItem[] | undefined> = useSyncExternalStore(
        appBridge.context('documentNavigation').subscribe,
        appBridge.context('documentNavigation').get,
    );

    useEffect(() => {
        appBridge.dispatch(hydrateContextDocumentNavigation(document.id()));
    }, [appBridge, document, portalNavigation]);

    return documentNavigation ? (documentNavigation[document.id()] ?? []) : [];
};
