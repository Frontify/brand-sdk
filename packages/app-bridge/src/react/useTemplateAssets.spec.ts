/* (c) Copyright Frontify Ltd., all rights reserved. */

import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { SinonStub } from 'sinon';
import { Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AssetDummy, getAppBridgeThemeStub } from '../tests';
import { useTemplateAssets } from './useTemplateAssets';

const DOCUMENT_ID = 16;
const DOCUMENT_PAGE_ID = 568;

describe('useTemplateAssets hook', () => {
    beforeEach(() => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
        cleanup();
    });

    const loadUseTemplateAssets = async (
        template: 'documentPage' | 'library' | 'cover',
        existingAssets = [AssetDummy.with(1)],
    ) => {
        const asset = AssetDummy.with(1);
        const appBridgeStub = getAppBridgeThemeStub({
            pageTemplateAssets: { key: existingAssets },
        });

        const { result, rerender } = renderHook(() =>
            useTemplateAssets(appBridgeStub, template, DOCUMENT_ID, DOCUMENT_PAGE_ID),
        );

        await act(async () => {
            rerender();
        });

        return { result, appBridgeStub, asset };
    };

    describe('documentPage template context', () => {
        it('should delete an asset', async () => {
            const { result, appBridgeStub } = await loadUseTemplateAssets('documentPage', []);
            await act(async () => {
                await result.current.deleteAssetIdsFromKey('key', [1]);
            });

            const call = appBridgeStub.deleteAssetIdsFromDocumentPageTemplateAssetKey.getCall(0);
            await waitFor(() => {
                expect(call.firstArg).toEqual(DOCUMENT_PAGE_ID);
                expect(call.args[1]).toEqual('key');
                expect(call.lastArg).toEqual([1]);
                expect(result.current.templateAssets).toStrictEqual({ key: [] });
            });
        });

        it('should sort assets', async () => {
            const { result, appBridgeStub } = await loadUseTemplateAssets('documentPage', [
                AssetDummy.with(1),
                AssetDummy.with(2),
            ]);

            await act(async () => {
                await result.current.updateAssetIdsFromKey('key', [2, 1]);
            });

            const deleteCall = appBridgeStub.deleteAssetIdsFromDocumentPageTemplateAssetKey.getCall(0);
            const addCall = appBridgeStub.addAssetIdsToDocumentPageTemplateAssetKey.getCall(0);

            await waitFor(async () => {
                expect(deleteCall.firstArg).toEqual(DOCUMENT_PAGE_ID);
                expect(deleteCall.args[1]).toEqual('key');
                expect(deleteCall.lastArg).toEqual([1, 2]);
                expect(addCall.firstArg).toEqual(DOCUMENT_PAGE_ID);
                expect(addCall.args[1]).toEqual('key');
                expect(addCall.lastArg).toEqual([2, 1]);
                expect(result.current.templateAssets['key'].map((asset) => asset.id)).toEqual([2, 1]);
            });
        });

        it('should not sort assets if api call throws error', async () => {
            const { result, appBridgeStub } = await loadUseTemplateAssets('documentPage', [
                AssetDummy.with(1),
                AssetDummy.with(2),
            ]);
            (appBridgeStub.deleteAssetIdsFromDocumentPageTemplateAssetKey as unknown as Mock) = vi
                .fn()
                .mockRejectedValue('Unsuccessful API call');

            await act(async () => {
                await result.current.updateAssetIdsFromKey('key', [2, 1]);
            });

            await waitFor(async () => {
                expect(result.current.templateAssets['key'].map((asset) => asset.id)).toEqual([1, 2]);
            });

            expect(console.error).toHaveBeenCalledOnce();
        });

        it('should notify about updated assets on delete', async () => {
            const { result, asset } = await loadUseTemplateAssets('documentPage');

            await act(async () => {
                await result.current.deleteAssetIdsFromKey('key', [1]);
            });

            const call = (window.emitter.emit as SinonStub).getCall(0);

            await waitFor(() => {
                expect(call.firstArg).toEqual('AppBridge:TemplateAssetsUpdated');
                expect(call.lastArg.template).toEqual('documentPage');
                expect(call.lastArg.documentId).toEqual(DOCUMENT_ID);
                expect(call.lastArg.documentPageId).toEqual(DOCUMENT_PAGE_ID);
                expect(call.lastArg.templateAssets).toStrictEqual({ key: [] });
                expect(call.lastArg.prevTemplateAssets).toMatchObject({ key: [asset] });
            });
        });

        it('should add asset ids', async () => {
            const { result, appBridgeStub } = await loadUseTemplateAssets('documentPage');
            await act(async () => {
                await result.current.addAssetIdsToKey('key', [2]);
            });

            const call = appBridgeStub.addAssetIdsToDocumentPageTemplateAssetKey.getCall(0);
            await waitFor(() => {
                expect(call.firstArg).toEqual(DOCUMENT_PAGE_ID);
                expect(call.args[1]).toEqual('key');
                expect(call.lastArg).toEqual([2]);
                expect(result.current.templateAssets['key'].map(({ id }) => id)).toEqual([1, 2]);
            });
        });

        it('should notify about updated assets on add asset ids to key', async () => {
            const { result, asset } = await loadUseTemplateAssets('documentPage');
            const assetToAdd = AssetDummy.with(2);
            await act(async () => {
                await result.current.addAssetIdsToKey('key', [assetToAdd.id]);
            });

            const call = (window.emitter.emit as SinonStub).getCall(0);
            await waitFor(() => {
                expect(call.firstArg).toEqual('AppBridge:TemplateAssetsUpdated');
                expect(call.lastArg.template).toEqual('documentPage');
                expect(call.lastArg.documentId).toEqual(DOCUMENT_ID);
                expect(call.lastArg.documentPageId).toEqual(DOCUMENT_PAGE_ID);
                expect(call.lastArg.templateAssets).toMatchObject({ key: [asset, assetToAdd] });
                expect(call.lastArg.prevTemplateAssets).toMatchObject({ key: [asset] });
            });
        });
    });

    describe('library template context', () => {
        it('should delete an asset', async () => {
            const { result, appBridgeStub } = await loadUseTemplateAssets('library', []);
            await act(async () => {
                await result.current.deleteAssetIdsFromKey('key', [1]);
            });

            const call = appBridgeStub.deleteAssetIdsFromLibraryPageTemplateAssetKey.getCall(0);
            await waitFor(() => {
                expect(call.firstArg).toEqual(DOCUMENT_ID);
                expect(call.args[1]).toEqual('key');
                expect(call.lastArg).toEqual([1]);
                expect(result.current.templateAssets).toStrictEqual({ key: [] });
            });
        });

        it('should sort assets', async () => {
            const { result, appBridgeStub } = await loadUseTemplateAssets('library', [
                AssetDummy.with(1),
                AssetDummy.with(2),
            ]);

            await act(async () => {
                await result.current.updateAssetIdsFromKey('key', [2, 1]);
            });

            const deleteCall = appBridgeStub.deleteAssetIdsFromLibraryPageTemplateAssetKey.getCall(0);
            const addCall = appBridgeStub.addAssetIdsToLibraryPageTemplateAssetKey.getCall(0);

            await waitFor(async () => {
                expect(deleteCall.firstArg).toEqual(DOCUMENT_ID);
                expect(deleteCall.args[1]).toEqual('key');
                expect(deleteCall.lastArg).toEqual([1, 2]);
                expect(addCall.firstArg).toEqual(DOCUMENT_ID);
                expect(addCall.args[1]).toEqual('key');
                expect(addCall.lastArg).toEqual([2, 1]);
                expect(result.current.templateAssets['key'].map((asset) => asset.id)).toEqual([2, 1]);
            });
        });

        it('should not sort assets if api call throws error', async () => {
            const { result, appBridgeStub } = await loadUseTemplateAssets('library', [
                AssetDummy.with(1),
                AssetDummy.with(2),
            ]);
            (appBridgeStub.deleteAssetIdsFromLibraryPageTemplateAssetKey as unknown as Mock) = vi
                .fn()
                .mockRejectedValue('Unsuccessful API call');

            await act(async () => {
                await result.current.updateAssetIdsFromKey('key', [2, 1]);
            });

            await waitFor(async () => {
                expect(result.current.templateAssets['key'].map((asset) => asset.id)).toEqual([1, 2]);
            });

            expect(console.error).toHaveBeenCalledOnce();
        });

        it('should notify about updated assets on delete', async () => {
            const { result, asset } = await loadUseTemplateAssets('library');

            await act(async () => {
                await result.current.deleteAssetIdsFromKey('key', [1]);
            });

            const call = (window.emitter.emit as SinonStub).getCall(0);

            await waitFor(() => {
                expect(call.firstArg).toEqual('AppBridge:TemplateAssetsUpdated');
                expect(call.lastArg.template).toEqual('library');
                expect(call.lastArg.documentId).toEqual(DOCUMENT_ID);
                expect(call.lastArg.documentPageId).toEqual(DOCUMENT_PAGE_ID);
                expect(call.lastArg.templateAssets).toStrictEqual({ key: [] });
                expect(call.lastArg.prevTemplateAssets).toMatchObject({ key: [asset] });
            });
        });

        it('should add asset ids', async () => {
            const { result, appBridgeStub } = await loadUseTemplateAssets('library');
            await act(async () => {
                await result.current.addAssetIdsToKey('key', [2]);
            });

            const call = appBridgeStub.addAssetIdsToLibraryPageTemplateAssetKey.getCall(0);
            await waitFor(() => {
                expect(call.firstArg).toEqual(DOCUMENT_ID);
                expect(call.args[1]).toEqual('key');
                expect(call.lastArg).toEqual([2]);
                expect(result.current.templateAssets['key'].map(({ id }) => id)).toEqual([1, 2]);
            });
        });

        it('should notify about updated assets on add asset ids to key', async () => {
            const { result, asset } = await loadUseTemplateAssets('library');
            const assetToAdd = AssetDummy.with(2);
            await act(async () => {
                await result.current.addAssetIdsToKey('key', [assetToAdd.id]);
            });

            const call = (window.emitter.emit as SinonStub).getCall(0);
            await waitFor(() => {
                expect(call.firstArg).toEqual('AppBridge:TemplateAssetsUpdated');
                expect(call.lastArg.template).toEqual('library');
                expect(call.lastArg.documentId).toEqual(DOCUMENT_ID);
                expect(call.lastArg.documentPageId).toEqual(DOCUMENT_PAGE_ID);
                expect(call.lastArg.templateAssets).toMatchObject({ key: [asset, assetToAdd] });
                expect(call.lastArg.prevTemplateAssets).toMatchObject({ key: [asset] });
            });
        });
    });

    describe('cover template context', () => {
        it('should delete an asset', async () => {
            const { result, appBridgeStub } = await loadUseTemplateAssets('cover', []);
            await act(async () => {
                await result.current.deleteAssetIdsFromKey('key', [1]);
            });

            const call = appBridgeStub.deleteAssetIdsFromCoverPageTemplateAssetKey.getCall(0);
            await waitFor(() => {
                expect(call.firstArg).toEqual('key');
                expect(call.lastArg).toEqual([1]);
                expect(result.current.templateAssets).toStrictEqual({ key: [] });
            });
        });

        it('should sort assets', async () => {
            const { result, appBridgeStub } = await loadUseTemplateAssets('cover', [
                AssetDummy.with(1),
                AssetDummy.with(2),
            ]);

            await act(async () => {
                await result.current.updateAssetIdsFromKey('key', [2, 1]);
            });

            const deleteCall = appBridgeStub.deleteAssetIdsFromCoverPageTemplateAssetKey.getCall(0);
            const addCall = appBridgeStub.addAssetIdsToCoverPageTemplateAssetKey.getCall(0);

            await waitFor(async () => {
                expect(deleteCall.firstArg).toEqual('key');
                expect(deleteCall.lastArg).toEqual([1, 2]);
                expect(addCall.firstArg).toEqual('key');
                expect(addCall.lastArg).toEqual([2, 1]);
                expect(result.current.templateAssets['key'].map((asset) => asset.id)).toEqual([2, 1]);
            });
        });

        it('should not sort assets if api call throws error', async () => {
            const { result, appBridgeStub } = await loadUseTemplateAssets('cover', [
                AssetDummy.with(1),
                AssetDummy.with(2),
            ]);
            (appBridgeStub.deleteAssetIdsFromCoverPageTemplateAssetKey as unknown as Mock) = vi
                .fn()
                .mockRejectedValue('Unsuccessful API call');

            await act(async () => {
                await result.current.updateAssetIdsFromKey('key', [2, 1]);
            });

            await waitFor(async () => {
                expect(result.current.templateAssets['key'].map((asset) => asset.id)).toEqual([1, 2]);
            });

            expect(console.error).toHaveBeenCalledOnce();
        });

        it('should notify about updated assets on delete', async () => {
            const { result, asset } = await loadUseTemplateAssets('cover');

            await act(async () => {
                await result.current.deleteAssetIdsFromKey('key', [1]);
            });

            const call = (window.emitter.emit as SinonStub).getCall(0);

            await waitFor(() => {
                expect(call.firstArg).toEqual('AppBridge:TemplateAssetsUpdated');
                expect(call.lastArg.template).toEqual('cover');
                expect(call.lastArg.documentId).toEqual(DOCUMENT_ID);
                expect(call.lastArg.documentPageId).toEqual(DOCUMENT_PAGE_ID);
                expect(call.lastArg.templateAssets).toStrictEqual({ key: [] });
                expect(call.lastArg.prevTemplateAssets).toMatchObject({ key: [asset] });
            });
        });

        it('should add asset ids', async () => {
            const { result, appBridgeStub } = await loadUseTemplateAssets('cover');
            await act(async () => {
                await result.current.addAssetIdsToKey('key', [2]);
            });

            const call = appBridgeStub.addAssetIdsToCoverPageTemplateAssetKey.getCall(0);
            await waitFor(() => {
                expect(call.firstArg).toEqual('key');
                expect(call.lastArg).toEqual([2]);
                expect(result.current.templateAssets['key'].map(({ id }) => id)).toEqual([1, 2]);
            });
        });

        it('should notify about updated assets on add asset ids to key', async () => {
            const { result, asset } = await loadUseTemplateAssets('cover');
            const assetToAdd = AssetDummy.with(2);
            await act(async () => {
                await result.current.addAssetIdsToKey('key', [assetToAdd.id]);
            });

            const call = (window.emitter.emit as SinonStub).getCall(0);
            await waitFor(() => {
                expect(call.firstArg).toEqual('AppBridge:TemplateAssetsUpdated');
                expect(call.lastArg.template).toEqual('cover');
                expect(call.lastArg.documentId).toEqual(DOCUMENT_ID);
                expect(call.lastArg.documentPageId).toEqual(DOCUMENT_PAGE_ID);
                expect(call.lastArg.templateAssets).toMatchObject({ key: [asset, assetToAdd] });
                expect(call.lastArg.prevTemplateAssets).toMatchObject({ key: [asset] });
            });
        });
    });
});
