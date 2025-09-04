/* (c) Copyright Frontify Ltd., all rights reserved. */

import { cleanup, render, waitFor } from '@testing-library/react';
import { type ReactElement } from 'react';
import sinon from 'sinon';
import { afterEach, describe, expect, it } from 'vitest';

import { type AppBridgeBlock } from '../AppBridgeBlock';
import { withAppBridgeBlockStubs } from '../tests/withAppBridgeBlockStubs';

import { useBlockSettings } from './useBlockSettings';

const BLOCK_SETTINGS_DIV_ID = 'block-settings-div';
const SET_BLOCK_SETTING_BUTTON = 'set-block-settings-button';
const SET_BLOCK_SETTING_NULL_BUTTON = 'set-block-settings-null-button';
const SET_BLOCK_SETTING_UNDEFINED_BUTTON = 'set-block-settings-undefined-button';
const NEW_SETTINGS = { foo: 'bar' };
const NEW_SETTINGS_2 = { hello: 'world' };
const NEW_SETTINGS_NULL = { foo: null };
const NEW_SETTINGS_UNDEFINED = { foo: undefined };
const BLOCK_1_ID = 345;
const BLOCK_2_ID = 456;

const Block = ({ appBridge }: { appBridge: AppBridgeBlock }): ReactElement => {
    const [blockSettings, updateBlockSettings] = useBlockSettings(appBridge);

    return (
        <div data-test-id={`block-${appBridge.context('blockId').get()}`}>
            <div data-test-id={BLOCK_SETTINGS_DIV_ID}>{JSON.stringify(blockSettings)}</div>
            <button
                onClick={() => updateBlockSettings(NEW_SETTINGS)}
                data-test-id={SET_BLOCK_SETTING_BUTTON}
                type="button"
            >
                Update block setting
            </button>
            <button
                onClick={() => updateBlockSettings(NEW_SETTINGS_NULL)}
                data-test-id={SET_BLOCK_SETTING_NULL_BUTTON}
                type="button"
            >
                Update block setting to null
            </button>
            <button
                onClick={() => updateBlockSettings(NEW_SETTINGS_UNDEFINED)}
                data-test-id={SET_BLOCK_SETTING_UNDEFINED_BUTTON}
                type="button"
            >
                Update block setting to undefined
            </button>
        </div>
    );
};

describe('useBlockSettings', () => {
    afterEach(() => {
        cleanup();
    });

    it('should initially set the block settings to an empty object', () => {
        const [BlockWithStubs] = withAppBridgeBlockStubs(Block);
        const { getByTestId } = render(<BlockWithStubs />);
        expect(getByTestId(BLOCK_SETTINGS_DIV_ID).textContent).toBe('{}');
    });

    it('should initially set the block settings to the API data', () => {
        const [BlockWithStubs] = withAppBridgeBlockStubs(Block, {
            blockSettings: NEW_SETTINGS,
        });

        const { getByTestId } = render(<BlockWithStubs />);
        expect(getByTestId(BLOCK_SETTINGS_DIV_ID).textContent).toBe(JSON.stringify(NEW_SETTINGS));
    });

    it('should update the block settings and save it to the database', async () => {
        const [BlockWithStubs, appBridge] = withAppBridgeBlockStubs(Block);

        const { getByTestId } = render(<BlockWithStubs />);
        expect(getByTestId(BLOCK_SETTINGS_DIV_ID).textContent).toBe('{}');

        const buttonElement = getByTestId(SET_BLOCK_SETTING_BUTTON);
        buttonElement.click();

        sinon.assert.calledOnceWithExactly(appBridge.updateBlockSettings, NEW_SETTINGS);

        await waitFor(() => {
            expect(getByTestId(BLOCK_SETTINGS_DIV_ID).textContent).toBe(JSON.stringify(NEW_SETTINGS));
        });
    });

    it('should only update the changed block setting and save it to the database', async () => {
        const [BlockWithStubs, appBridge] = withAppBridgeBlockStubs(Block, {
            blockSettings: NEW_SETTINGS_2,
        });

        const { getByTestId } = render(<BlockWithStubs />);

        const buttonElement = getByTestId(SET_BLOCK_SETTING_BUTTON);
        buttonElement.click();

        sinon.assert.calledOnceWithExactly(appBridge.updateBlockSettings, NEW_SETTINGS);

        await waitFor(() => {
            expect(getByTestId(BLOCK_SETTINGS_DIV_ID).textContent).toBe(
                JSON.stringify({ ...NEW_SETTINGS_2, ...NEW_SETTINGS }),
            );
        });
    });

    it('should merge the block settings and save it to the database', async () => {
        const CURRENT_SETTINGS = { url: 'https://frontify.com' };

        const [BlockWithStubs, appBridge] = withAppBridgeBlockStubs(Block, {
            blockSettings: CURRENT_SETTINGS,
        });

        const { getByTestId } = render(<BlockWithStubs />);
        expect(getByTestId(BLOCK_SETTINGS_DIV_ID).textContent).toBe(JSON.stringify(CURRENT_SETTINGS));

        const buttonElement = getByTestId(SET_BLOCK_SETTING_BUTTON);
        buttonElement.click();

        sinon.assert.calledOnceWithExactly(appBridge.updateBlockSettings, NEW_SETTINGS);

        await waitFor(() => {
            expect(getByTestId(BLOCK_SETTINGS_DIV_ID).textContent).toBe(
                JSON.stringify({ ...CURRENT_SETTINGS, ...NEW_SETTINGS }),
            );
        });
    });

    it('should overwrite the block settings and save it to the database', async () => {
        const CURRENT_SETTINGS = { foo: 'https://frontify.com' };

        const [BlockWithStubs, appBridge] = withAppBridgeBlockStubs(Block, {
            blockSettings: CURRENT_SETTINGS,
        });

        const { getByTestId } = render(<BlockWithStubs />);
        expect(getByTestId(BLOCK_SETTINGS_DIV_ID).textContent).toBe(JSON.stringify(CURRENT_SETTINGS));

        const buttonElement = getByTestId(SET_BLOCK_SETTING_BUTTON);
        buttonElement.click();

        sinon.assert.calledOnceWithExactly(appBridge.updateBlockSettings, NEW_SETTINGS);

        await waitFor(() => {
            expect(getByTestId(BLOCK_SETTINGS_DIV_ID).textContent).toBe(JSON.stringify(NEW_SETTINGS));
        });
    });

    it('should set a setting to null and save it to the database', async () => {
        const CURRENT_SETTINGS = { foo: 'https://frontify.com' };

        const [BlockWithStubs, appBridge] = withAppBridgeBlockStubs(Block, {
            blockSettings: CURRENT_SETTINGS,
        });

        const { getByTestId } = render(<BlockWithStubs />);
        expect(getByTestId(BLOCK_SETTINGS_DIV_ID).textContent).toBe(JSON.stringify(CURRENT_SETTINGS));

        const buttonElement = getByTestId(SET_BLOCK_SETTING_NULL_BUTTON);
        buttonElement.click();

        sinon.assert.calledOnceWithExactly(appBridge.updateBlockSettings, NEW_SETTINGS_NULL);

        await waitFor(() => {
            expect(getByTestId(BLOCK_SETTINGS_DIV_ID).textContent).toBe(JSON.stringify(NEW_SETTINGS_NULL));
        });
    });

    it('should set a setting to undefined and save it to the database', async () => {
        const CURRENT_SETTINGS = { foo: 'https://frontify.com' };

        const [BlockWithStubs, appBridge] = withAppBridgeBlockStubs(Block, {
            blockSettings: CURRENT_SETTINGS,
        });

        const { getByTestId } = render(<BlockWithStubs />);
        expect(getByTestId(BLOCK_SETTINGS_DIV_ID).textContent).toBe(JSON.stringify(CURRENT_SETTINGS));

        const buttonElement = getByTestId(SET_BLOCK_SETTING_UNDEFINED_BUTTON);
        buttonElement.click();

        sinon.assert.calledOnceWithExactly(appBridge.updateBlockSettings, NEW_SETTINGS_UNDEFINED);

        await waitFor(() => {
            expect(getByTestId(BLOCK_SETTINGS_DIV_ID).textContent).toBe(JSON.stringify(NEW_SETTINGS_UNDEFINED));
        });
    });

    it('gets the correct settings when rendering 2 blocks', () => {
        const CURRENT_SETTINGS = { foo: 'https://frontify.com' };

        const [Block1WithStubs] = withAppBridgeBlockStubs(Block, {
            blockId: BLOCK_1_ID,
            blockSettings: CURRENT_SETTINGS,
        });
        const [Block2WithStubs] = withAppBridgeBlockStubs(Block, { blockId: BLOCK_2_ID });

        const { getByTestId } = render(
            <div>
                <Block1WithStubs />
                <Block2WithStubs />
            </div>,
        );

        const block1 = getByTestId(`block-${BLOCK_1_ID}`);
        const block2 = getByTestId(`block-${BLOCK_2_ID}`);
        const block1Settings = block1.querySelector(`[data-test-id="${BLOCK_SETTINGS_DIV_ID}"]`);
        const block2Settings = block2.querySelector(`[data-test-id="${BLOCK_SETTINGS_DIV_ID}"]`);

        expect(block1Settings?.textContent).toBe(JSON.stringify(CURRENT_SETTINGS));
        expect(block2Settings?.textContent).toBe('{}');
    });

    it('sets correctly the settings when rendering 2 blocks', async () => {
        const CURRENT_SETTINGS = { foo: 'https://frontify.com' };

        const [Block1WithStubs, appBridge1] = withAppBridgeBlockStubs(Block, {
            blockId: BLOCK_1_ID,
            blockSettings: CURRENT_SETTINGS,
        });
        const [Block2WithStubs, appBridge2] = withAppBridgeBlockStubs(Block, { blockId: BLOCK_2_ID });

        const { getByTestId } = render(
            <div>
                <Block1WithStubs />
                <Block2WithStubs />
            </div>,
        );

        const block1 = getByTestId(`block-${BLOCK_1_ID}`);
        const block2 = getByTestId(`block-${BLOCK_2_ID}`);
        const block1Settings = block1.querySelector(`[data-test-id="${BLOCK_SETTINGS_DIV_ID}"]`);
        const block2Settings = block2.querySelector(`[data-test-id="${BLOCK_SETTINGS_DIV_ID}"]`);

        const block1SetSettingButton = block1.querySelector(
            `[data-test-id="${SET_BLOCK_SETTING_BUTTON}"]`,
        ) as Nullable<HTMLButtonElement>;
        const block2SetNullSettingButton = block2.querySelector(
            `[data-test-id="${SET_BLOCK_SETTING_NULL_BUTTON}"]`,
        ) as Nullable<HTMLButtonElement>;

        block1SetSettingButton?.click();
        sinon.assert.calledOnceWithExactly(appBridge1.updateBlockSettings, NEW_SETTINGS);

        await waitFor(() => {
            expect(block1Settings?.textContent).toBe(JSON.stringify(NEW_SETTINGS));
            expect(block2Settings?.textContent).toBe('{}');
        });

        block2SetNullSettingButton?.click();
        sinon.assert.calledOnceWithExactly(appBridge2.updateBlockSettings, NEW_SETTINGS_NULL);

        await waitFor(() => {
            expect(block1Settings?.textContent).toBe(JSON.stringify(NEW_SETTINGS));
            expect(block2Settings?.textContent).toBe(JSON.stringify(NEW_SETTINGS_NULL));
        });
    });

    it('set the settings of the 2 blocks when they have the same id', async () => {
        const SAME_ID = 435;
        const [Block1WithStubs] = withAppBridgeBlockStubs(Block, { blockId: SAME_ID });
        const [Block2WithStubs] = withAppBridgeBlockStubs(Block, { blockId: SAME_ID });

        const { getAllByTestId } = render(
            <div>
                <Block1WithStubs />
                <Block2WithStubs />
            </div>,
        );

        const blocks = getAllByTestId(`block-${SAME_ID}`);
        const block1Settings = blocks[0].querySelector(`[data-test-id="${BLOCK_SETTINGS_DIV_ID}"]`);
        const block2Settings = blocks[1].querySelector(`[data-test-id="${BLOCK_SETTINGS_DIV_ID}"]`);

        await waitFor(() => {
            expect(block1Settings?.textContent).toBe('{}');
            expect(block2Settings?.textContent).toBe('{}');
        });

        const block1SetSettingButton = blocks[0].querySelector(
            `[data-test-id="${SET_BLOCK_SETTING_BUTTON}"]`,
        ) as Nullable<HTMLButtonElement>;

        block1SetSettingButton?.click();

        await waitFor(() => {
            expect(block1Settings?.textContent).toBe(JSON.stringify(NEW_SETTINGS));
            expect(block2Settings?.textContent).toBe(JSON.stringify(NEW_SETTINGS));
        });
    });
});
