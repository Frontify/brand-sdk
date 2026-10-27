/* (c) Copyright Frontify Ltd., all rights reserved. */

import mitt, { type Emitter } from 'mitt';
import sinon from 'sinon';

import { type EventCallbackParameter } from '../AppBridge';
import { type AppBridgeBlock, type BlockEvent } from '../AppBridgeBlock';
import { type Template, type TemplateLegacy, type User } from '../types';
import { type Asset } from '../types/Asset';
import { type EmitterEvents } from '../types/Emitter';
import { type PrivacySettings } from '../types/PrivacySettings';

import { AssetDummy } from './AssetDummy';
import { BulkDownloadDummy } from './BulkDownloadDummy';
import { ColorPaletteDummy } from './ColorPaletteDummy';
import { TemplateDummy } from './TemplateDummy';
import { TemplateLegacyDummy } from './TemplateLegacyDummy';
import { UserDummy } from './UserDummy';

const BLOCK_ID = 3452;
const SECTION_ID = 2341;
const USER_ID = 4561;
const PROJECT_ID = 345214;

type ChosenEventName = 'assetsChosen' | 'linkChosen' | 'templateChosen';

type StubSubscription = { callback: (payload: unknown) => void };

const stubSubscriptions = new WeakMap<AppBridgeBlock, Map<string, Set<StubSubscription>>>();

export type getAppBridgeBlockStubProps = {
    blockSettings?: Record<string, unknown>;
    blockAssets?: Record<string, Asset[]>;
    editorState?: boolean;
    blockId?: number;
    sectionId?: number;
    projectId?: number;
    isNewlyInserted?: boolean;
    isAuthenticated?: boolean;
    user?: User;
    language?: string;
    privacySettings?: PrivacySettings;
    blockTemplates?: Record<string, Template[]>;
    unsubscribe?: () => void;
    emitChosenEventsOnSubscribe?: boolean;
};

export const getAppBridgeBlockStub = ({
    blockSettings = {},
    blockAssets = {},
    editorState = false,
    blockId = BLOCK_ID,
    sectionId = SECTION_ID,
    projectId = PROJECT_ID,
    isNewlyInserted = false,
    isAuthenticated = true,
    user = UserDummy.with(USER_ID),
    language = 'en',
    privacySettings = {
        assetViewerEnabled: false,
        assetDownloadEnabled: false,
    },
    blockTemplates = {},
    unsubscribe = () => null,
    emitChosenEventsOnSubscribe = true,
}: getAppBridgeBlockStubProps = {}): sinon.SinonStubbedInstance<AppBridgeBlock> => {
    window.emitter = sinon.spy(mitt()) as unknown as Emitter<EmitterEvents>;

    window.blockSettings ??= {};
    window.blockSettings[blockId] = blockSettings;

    const deletedAssetIds: Record<string, number[]> = {};
    const addedAssetIds: Record<string, number[]> = {};
    const deletedTemplateIds: Record<string, number[]> = {};
    const addedTemplateIds: Record<string, number[]> = {};

    const contextAssetsSubscribers: Set<(nextAssets: Record<string, Asset[]>) => void> = new Set();
    let contextAssets = blockAssets;

    const computeBlockAssets = (): Record<string, Asset[]> =>
        Object.entries(blockAssets).reduce<Record<string, Asset[]>>((assetsDiff, [key, assets]) => {
            const addedAssetIdsList = addedAssetIds[key] ?? [];
            const deletedAssetIdsList = deletedAssetIds[key] ?? [];
            assetsDiff[key] = [
                ...assets.filter((asset) => !deletedAssetIdsList.includes(asset.id)),
                ...addedAssetIdsList.map((id) => AssetDummy.with(id)),
            ];
            return assetsDiff;
        }, {});

    const updateContextAssets = () => {
        contextAssets = computeBlockAssets();
        for (const subscriber of contextAssetsSubscribers) {
            subscriber(contextAssets);
        }
    };

    const subscriptions = new Map<string, Set<StubSubscription>>();

    const appBridgeStub: sinon.SinonStubbedInstance<AppBridgeBlock> = {
        getProjectId: sinon.stub<Parameters<AppBridgeBlock['getProjectId']>>().returns(projectId),
        getEditorState: sinon.stub<Parameters<AppBridgeBlock['getEditorState']>>().returns(editorState),
        getBlockSettings: sinon.stub<Parameters<AppBridgeBlock['getBlockSettings']>>().resolves(window.blockSettings),
        getCurrentLoggedUser: sinon.stub<Parameters<AppBridgeBlock['getCurrentLoggedUser']>>().resolves(user),
        getAssetById: sinon
            .stub<Parameters<AppBridgeBlock['getAssetById']>>()
            .callsFake((assetId) => Promise.resolve(AssetDummy.with(assetId))),
        getBlockAssets: sinon
            .stub<Parameters<AppBridgeBlock['getBlockAssets']>>()
            .callsFake(() => computeBlockAssets()),
        addAssetIdsToBlockAssetKey: sinon
            .stub<Parameters<AppBridgeBlock['addAssetIdsToBlockAssetKey']>>()
            .callsFake((key, assetsIds) => {
                addedAssetIds[key] = [...(addedAssetIds[key] ?? []), ...assetsIds];
                updateContextAssets();
            }),
        deleteAssetIdsFromBlockAssetKey: sinon
            .stub<Parameters<AppBridgeBlock['deleteAssetIdsFromBlockAssetKey']>>()
            .callsFake((key, assetIds) => {
                deletedAssetIds[key] = [...(deletedAssetIds[key] ?? []), ...assetIds];
                updateContextAssets();
            }),
        getBlockTemplates: sinon.stub<Parameters<AppBridgeBlock['getBlockTemplates']>>().callsFake(() => {
            return Object.entries(blockTemplates).reduce<Record<string, Template[]>>(
                (templatesDiff, [key, templates]) => {
                    const addedTemplateIdsList = addedTemplateIds[key] ?? [];
                    const deletedTemplateIdsList = deletedTemplateIds[key] ?? [];
                    templatesDiff[key] = [
                        ...templates.filter((template) => !deletedTemplateIdsList.includes(template.id)),
                        ...addedTemplateIdsList.map((id) => TemplateDummy.with(id)),
                    ];
                    return templatesDiff;
                },
                {},
            );
        }),
        addTemplateIdsToBlockTemplateKey: sinon
            .stub<Parameters<AppBridgeBlock['addTemplateIdsToBlockTemplateKey']>>()
            .callsFake((key, templateIds) => {
                addedTemplateIds[key] = [...(addedTemplateIds[key] ?? []), ...templateIds];
            }),
        deleteTemplateIdsFromBlockTemplateKey: sinon
            .stub<Parameters<AppBridgeBlock['deleteTemplateIdsFromBlockTemplateKey']>>()
            .callsFake((key, templateIds) => {
                deletedTemplateIds[key] = [...(deletedTemplateIds[key] ?? []), ...templateIds];
            }),
        getTranslationLanguage: sinon.stub<Parameters<AppBridgeBlock['getTranslationLanguage']>>().returns(language),
        getBulkDownloadBySignature: sinon
            .stub<Parameters<AppBridgeBlock['getBulkDownloadBySignature']>>()
            .resolves(BulkDownloadDummy.default()),
        getBulkDownloadByToken: sinon
            .stub<Parameters<AppBridgeBlock['getBulkDownloadByToken']>>()
            .resolves(BulkDownloadDummy.default()),
        getPrivacySettings: sinon.stub<Parameters<AppBridgeBlock['getPrivacySettings']>>().returns(privacySettings),
        api: sinon.stub<Parameters<AppBridgeBlock['api']>>().callsFake((args) => {
            switch (args.name) {
                case 'getAssetBulkDownloadToken': {
                    return { assetBulkDownloadToken: 'token' };
                }
                case 'setAssetIdsByBlockAssetKey': {
                    blockAssets[args.payload.key] = args.payload.assetIds.map((id) => AssetDummy.with(id));
                    updateContextAssets();
                    return Promise.resolve();
                }
            }

            throw new Error('Method is not stubbed');
        }),

        context: sinon.stub<Parameters<AppBridgeBlock['context']>>().callsFake((args) => {
            if (args === undefined) {
                return {
                    get: () => [blockId, sectionId, isAuthenticated],
                };
            } else {
                switch (args) {
                    case 'blockId':
                        return {
                            get: () => blockId,
                        };
                    case 'sectionId':
                        return {
                            get: () => sectionId,
                        };

                    case 'isAuthenticated':
                        return {
                            get: () => isAuthenticated,
                        };
                    case 'isNewlyInserted':
                        return {
                            get: () => isNewlyInserted,
                        };
                    case 'isEditing':
                        return {
                            get: () => editorState,
                            subscribe: () => () => {},
                        };
                    case 'assets':
                        return {
                            get: () => contextAssets,
                            subscribe: (callback: (nextAssets: Record<string, Asset[]>) => void) => {
                                contextAssetsSubscribers.add(callback);
                                return () => {
                                    contextAssetsSubscribers.delete(callback);
                                };
                            },
                        };
                    default:
                        return {
                            get: () => {
                                throw new Error(`Unknown context key: ${args}`);
                            },
                        };
                }
            }
        }),

        subscribe: sinon.stub<Parameters<AppBridgeBlock['subscribe']>>().callsFake((eventName, callback) => {
            const subscription: StubSubscription = { callback: callback as StubSubscription['callback'] };
            const eventSubscriptions = subscriptions.get(eventName) ?? new Set<StubSubscription>();
            eventSubscriptions.add(subscription);
            subscriptions.set(eventName, eventSubscriptions);

            if (emitChosenEventsOnSubscribe) {
                if (eventName === 'assetsChosen') {
                    (callback as EventCallbackParameter<'assetsChosen', BlockEvent>)({
                        assets: [AssetDummy.with(123)],
                    });
                } else if (eventName === 'templateChosen') {
                    (callback as EventCallbackParameter<'templateChosen', BlockEvent>)({
                        template: TemplateLegacyDummy.with(234),
                    });
                } else if (eventName === 'linkChosen') {
                    (callback as EventCallbackParameter<'linkChosen', BlockEvent>)({ url: 'https://example.com' });
                }
            }

            return () => {
                eventSubscriptions.delete(subscription);
                unsubscribe();
            };
        }),

        getColorPalettesWithColors: sinon
            .stub<Parameters<AppBridgeBlock['getColorPalettesWithColors']>>()
            .resolves([
                ColorPaletteDummy.with(678, 'Palette 1'),
                ColorPaletteDummy.with(427, 'Palette 2'),
                ColorPaletteDummy.with(679, 'Palette 3'),
            ]),

        // TODO: Stub the following methods
        getTemplateById: sinon.stub<Parameters<AppBridgeBlock['getTemplateById']>>().resolves({} as TemplateLegacy),
        updateBlockSettings: sinon.stub<Parameters<AppBridgeBlock['updateBlockSettings']>>().resolves(),
        state: sinon.stub<Parameters<AppBridgeBlock['state']>>().resolves(),
        dispatch: sinon.stub<Parameters<AppBridgeBlock['dispatch']>>().resolves(),
    };

    stubSubscriptions.set(appBridgeStub, subscriptions);

    return appBridgeStub;
};

export const emitAppBridgeBlockStubEvent = <EventName extends ChosenEventName>(
    appBridge: AppBridgeBlock,
    eventName: EventName,
    payload: Parameters<EventCallbackParameter<EventName, BlockEvent>>[0],
) => {
    const subscriptions = stubSubscriptions.get(appBridge);
    if (!subscriptions) {
        throw new Error('emitAppBridgeBlockStubEvent only works with an app bridge from getAppBridgeBlockStub.');
    }

    // Copy the subscriptions first, a callback may unsubscribe while the event is sent.
    for (const { callback } of [...(subscriptions.get(eventName) ?? [])]) {
        callback(payload);
    }
};
