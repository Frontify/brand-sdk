/* (c) Copyright Frontify Ltd., all rights reserved. */

import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useAssetUpload } from './useAssetUpload';

type FakeWorker = {
    emit: (data: Record<string, unknown>) => void;
};

const workers = vi.hoisted(() => [] as FakeWorker[]);

vi.mock('../workers/upload.worker.js?worker&inline', () => ({
    default: class {
        listener?: (event: { data: Record<string, unknown> }) => void;
        postMessage = vi.fn();
        terminate = vi.fn();

        constructor() {
            workers.push(this);
        }

        addEventListener(_type: string, listener: (event: { data: Record<string, unknown> }) => void) {
            this.listener = listener;
        }

        emit(data: Record<string, unknown>) {
            this.listener?.({ data });
        }
    },
}));

describe('useAssetUpload hook', () => {
    afterEach(() => {
        workers.length = 0;
        cleanup();
    });

    it('should keep the same upload function when the callbacks change on every render', () => {
        const { result, rerender } = renderHook(() => useAssetUpload({ onUploadProgress: () => {} }));
        const [uploadFiles] = result.current;

        rerender();

        expect(result.current[0]).toBe(uploadFiles);
    });

    it('should call the latest onUploadProgress for worker events', () => {
        const firstOnUploadProgress = vi.fn();
        const latestOnUploadProgress = vi.fn();
        const { result, rerender } = renderHook(({ onUploadProgress }) => useAssetUpload({ onUploadProgress }), {
            initialProps: { onUploadProgress: firstOnUploadProgress },
        });

        act(() => {
            result.current[0](new File(['content'], 'file.txt'));
        });
        rerender({ onUploadProgress: latestOnUploadProgress });
        act(() => {
            workers[0].emit({ event: 'onProgress' });
        });

        expect(firstOnUploadProgress).not.toHaveBeenCalled();
        expect(latestOnUploadProgress).toHaveBeenCalledOnce();
    });
});
