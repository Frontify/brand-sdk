/* (c) Copyright Frontify Ltd., all rights reserved. */

import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { type SinonStub } from 'sinon';
import { type Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { type ThemeTemplate } from '..';
import { AssetDummy, getAppBridgeThemeStub } from '../tests';

import { useTemplateAssets } from './useTemplateAssets';

const DOCUMENT_ID = 16;
const DOCUMENT_PAGE_ID = 568;

const THEME_ASSETS = {
    key: [AssetDummy.with(3)],
};

const THEME_ASSETS_WITH_CUSTOM_KEY = {
    customKey: [AssetDummy.with(2)],
};

const TEMPLATE_ASSETS = {
    key: [AssetDummy.with(1)],
};

describe('useTemplateAssets hook', () => {
    beforeEach(() => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
        cleanup();
    });

    const loadUseTemplateAssets = async (
        template: ThemeTemplate,
        existingTemplateAssets = [AssetDummy.with(1)],
        existingThemeAssets = {},
        returnEmptyTemplateAssets = false,
    ) => {
        const asset = AssetDummy.with(1);
        const appBridgeStub = getAppBridgeThemeStub({
            pageTemplateAssets: returnEmptyTemplateAssets ? {} : { key: existingTemplateAssets },
            themeAssets: existingThemeAssets,
        });

        const { result, rerender } = renderHook(() =>
            useTemplateAssets(appBridgeStub, template, DOCUMENT_ID, DOCUMENT_PAGE_ID),
        );

        // for some reason necessary
        // eslint-disable-next-line @typescript-eslint/require-await
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

            await waitFor(() => {
                expect(deleteCall.firstArg).toEqual(DOCUMENT_PAGE_ID);
                expect(deleteCall.args[1]).toEqual('key');
                expect(deleteCall.lastArg).toEqual([1, 2]);
                expect(addCall.firstArg).toEqual(DOCUMENT_PAGE_ID);
                expect(addCall.args[1]).toEqual('key');
                expect(addCall.lastArg).toEqual([2, 1]);
                expect(result.current.templateAssets.key.map((asset) => asset.id)).toEqual([2, 1]);
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

            await waitFor(() => {
                expect(result.current.templateAssets.key.map((asset) => asset.id)).toEqual([1, 2]);
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
                expect(result.current.templateAssets.key.map(({ id }) => id)).toEqual([1, 2]);
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

            await waitFor(() => {
                expect(deleteCall.firstArg).toEqual(DOCUMENT_ID);
                expect(deleteCall.args[1]).toEqual('key');
                expect(deleteCall.lastArg).toEqual([1, 2]);
                expect(addCall.firstArg).toEqual(DOCUMENT_ID);
                expect(addCall.args[1]).toEqual('key');
                expect(addCall.lastArg).toEqual([2, 1]);
                expect(result.current.templateAssets.key.map((asset) => asset.id)).toEqual([2, 1]);
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

            await waitFor(() => {
                expect(result.current.templateAssets.key.map((asset) => asset.id)).toEqual([1, 2]);
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
                expect(result.current.templateAssets.key.map(({ id }) => id)).toEqual([1, 2]);
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

            await waitFor(() => {
                expect(deleteCall.firstArg).toEqual('key');
                expect(deleteCall.lastArg).toEqual([1, 2]);
                expect(addCall.firstArg).toEqual('key');
                expect(addCall.lastArg).toEqual([2, 1]);
                expect(result.current.templateAssets.key.map((asset) => asset.id)).toEqual([2, 1]);
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

            await waitFor(() => expect(result.current.templateAssets.key.map((asset) => asset.id)).toEqual([1, 2]));

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
                expect(result.current.templateAssets.key.map(({ id }) => id)).toEqual([1, 2]);
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

    describe('Theme and Template assets overrides', () => {
        it('returns the template assets merged with theme assets and the list of custom overrides', async () => {
            const { result } = await loadUseTemplateAssets('cover', [AssetDummy.with(1)], THEME_ASSETS);
            await waitFor(() => {
                expect(result.current.templateAssets).toEqual({
                    ...TEMPLATE_ASSETS,
                });
                expect(result.current.customizedTemplateAssetsKeys).toEqual(['key']);
            });
        });

        it('returns the template assets merged with theme assets and no overrides', async () => {
            const { result } = await loadUseTemplateAssets('cover', [AssetDummy.with(1)], THEME_ASSETS_WITH_CUSTOM_KEY);
            await waitFor(() => {
                expect(result.current.templateAssets).toEqual({
                    ...THEME_ASSETS_WITH_CUSTOM_KEY,
                    ...TEMPLATE_ASSETS,
                });
                expect(result.current.customizedTemplateAssetsKeys).toEqual([]);
            });
        });

        it('returns an empty object if no theme assets and no template assets', async () => {
            const { result } = await loadUseTemplateAssets('cover', [], {}, true);
            await waitFor(() => {
                expect(result.current.templateAssets).toEqual({});
                expect(result.current.customizedTemplateAssetsKeys).toEqual([]);
            });
        });

        it('returns only the theme assets if no template assets', async () => {
            const { result } = await loadUseTemplateAssets('cover', [], THEME_ASSETS, true);
            await waitFor(() => {
                expect(result.current.templateAssets).toEqual({
                    ...THEME_ASSETS,
                });
                expect(result.current.customizedTemplateAssetsKeys).toEqual([]);
            });
        });

        it('returns only the template assets if no theme assets', async () => {
            const { result } = await loadUseTemplateAssets('cover', [AssetDummy.with(1)], {}, false);
            await waitFor(() => {
                expect(result.current.templateAssets).toEqual({
                    ...TEMPLATE_ASSETS,
                });
                expect(result.current.customizedTemplateAssetsKeys).toEqual([]);
            });
        });
    });
});
