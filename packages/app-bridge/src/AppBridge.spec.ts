/* (c) Copyright Frontify Ltd., all rights reserved. */

import { describe, expect, it } from 'vitest';
import { AppBridge } from './AppBridge';
import { AppBridgeBlock } from './AppBridgeBlock';
import { AppBridgeCreateAsset } from './AppBridgeCreateAsset';
import { AppBridgeTheme } from './AppBridgeTheme';

const BLOCK_ID = 324;
const SECTION_ID = 9453;
const PORTAL_ID = 945;

describe('AppBridge', () => {
    it('should create an block app bridge instance with block and section id', () => {
        const appBridge = new AppBridge('block', { blockId: BLOCK_ID, sectionId: SECTION_ID });
        expect(appBridge).toBeInstanceOf(AppBridgeBlock);
        expect(appBridge.getBlockId()).toBe(BLOCK_ID);
        expect(appBridge.getSectionId()).toBe(SECTION_ID);
    });

    it('should create an block app bridge instance with block id', () => {
        const appBridge = new AppBridge('block', { blockId: BLOCK_ID });
        expect(appBridge).toBeInstanceOf(AppBridgeBlock);
        expect(appBridge.getBlockId()).toBe(BLOCK_ID);
        expect(appBridge.getSectionId()).toBeUndefined();
    });

    it('should create an theme app bridge instance with guideline id', () => {
        const appBridge = new AppBridge('theme', { portalId: PORTAL_ID });
        expect(appBridge).toBeInstanceOf(AppBridgeTheme);
        expect(appBridge.getPortalId()).toBe(PORTAL_ID);
    });

    it('should create an create-asset app bridge instance', () => {
        const appBridge = new AppBridge('create-asset');
        expect(appBridge).toBeInstanceOf(AppBridgeCreateAsset);
    });
});
