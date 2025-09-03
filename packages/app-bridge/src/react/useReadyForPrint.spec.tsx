/* (c) Copyright Frontify Ltd., all rights reserved. */

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import { getAppBridgeBlockStub } from '../tests';

import { useReadyForPrint } from './useReadyForPrint';

const IS_READY_CONTAINER = 'is-ready-container';
const SET_TO_FALSE_BUTTON = 'set-to-false-button';
const SET_TO_TRUE_BUTTON = 'set-to-true-button';
const IS_READY_FOR_PRINT = 'is ready for print';
const IS_NOT_READY_FOR_PRINT = 'is not ready for print';
const BLOCK_ID = 345;

const ReadyForPrintDummy = ({ dataBlockId = BLOCK_ID } = {}) => {
    const appBridge = getAppBridgeBlockStub({ blockId: BLOCK_ID });
    const { isReadyForPrint, setIsReadyForPrint } = useReadyForPrint(appBridge);

    return (
        <div data-test-id={IS_READY_CONTAINER} className="mod block" data-block={dataBlockId}>
            <div>
                {(isReadyForPrint && IS_READY_FOR_PRINT) || IS_NOT_READY_FOR_PRINT}
                <button data-test-id={SET_TO_FALSE_BUTTON} onClick={() => setIsReadyForPrint(false)} type="button" />
                <button data-test-id={SET_TO_TRUE_BUTTON} onClick={() => setIsReadyForPrint(true)} type="button" />
            </div>
        </div>
    );
};

describe('useReadyForPrint hook', () => {
    afterEach(() => {
        cleanup();
        vi.restoreAllMocks();
    });

    test('Should initially set the data-ready attribute to false', () => {
        render(<ReadyForPrintDummy />);

        const container = screen.getByTestId(IS_READY_CONTAINER);

        expect(container.getAttribute('data-ready')).toBe('false');
        expect(screen.getByText(IS_NOT_READY_FOR_PRINT)).toBeDefined();
    });

    test('Should change data-ready', () => {
        render(<ReadyForPrintDummy />);

        const setToFalseButton = screen.getByTestId(SET_TO_FALSE_BUTTON);
        const setToTrueButton = screen.getByTestId(SET_TO_TRUE_BUTTON);
        const container = screen.getByTestId(IS_READY_CONTAINER);

        fireEvent.click(setToTrueButton);

        expect(container.getAttribute('data-ready')).toBe('true');
        expect(screen.getByText(IS_READY_FOR_PRINT)).toBeDefined();

        fireEvent.click(setToFalseButton);

        expect(container.getAttribute('data-ready')).toBe('false');
        expect(screen.getByText(IS_NOT_READY_FOR_PRINT)).toBeDefined();
    });

    test('Should throw an error if no blockId is provided', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        render(<ReadyForPrintDummy dataBlockId={123} />);
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Could not find block wrapper:'), BLOCK_ID);
    });
});
