/* (c) Copyright Frontify Ltd., all rights reserved. */

import { useEffect } from 'react';
import { AppBridgeBlock } from '../AppBridgeBlock';

/**
 * Hook to execute a callback after the block has been inserted.
 * The callback is only executed when the third argument is true (default).
 *
 * @example
 * // Block that focuses a button on insertion after an async function has completed.
 * const ExampleBlock = ({ appBridge }: BlockProps) => {
 *    const buttonRef = useRef<HTMLButtonElement>(null);
 *    const [data, setData] = useState(null);
 *    const hasData = data !== null;
 *
 *    useEffect(() => {
 *      getAsyncData().then((data) => setData(data));
 *    }, []);
 *
 *    useAfterInsertion(appBridge, () => buttonRef.current?.focus(), hasData);
 *
 *    return hasData ?
 *      <button ref={buttonRef} onClick={() => console.log("Creating new item...")}>Create New Item</Button> :
 *      <div>Loading...</div>;
 * };
 */

export const useAfterInsertion = <T extends AppBridgeBlock>(appBridge: T, callback: () => void, enabled = true) => {
    useEffect(() => {
        const isNewlyInserted = appBridge.context('isNewlyInserted').get();
        if (enabled && isNewlyInserted) {
            callback();
        }
    }, [enabled, callback, appBridge]);

    return appBridge;
};
