/* (c) Copyright Frontify Ltd., all rights reserved. */

import { act, cleanup, renderHook } from '@testing-library/react';
import { type Mock, afterEach, describe, expect, it, vi } from 'vitest';

import { useFileUpload } from './useFileUpload';

type FakeWorker = {
    postMessage: Mock;
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

describe('useFileUpload hook', () => {
    afterEach(() => {
        workers.length = 0;
        cleanup();
    });

    it('should keep the same upload function across re-renders', () => {
        const { result, rerender } = renderHook(() => useFileUpload({ onUploadDone: () => {} }));
        const [uploadFiles] = result.current;

        rerender();

        expect(result.current[0]).toBe(uploadFiles);
    });

    it('should send the files to the worker', () => {
        const file = new File(['content'], 'file.txt');
        const { result } = renderHook(() => useFileUpload());

        act(() => {
            result.current[0](file);
        });

        expect(workers).toHaveLength(1);
        expect(workers[0].postMessage).toHaveBeenCalledWith({ files: [file] });
    });

    it('should call the latest callbacks for worker events', () => {
        const firstOnUploadDone = vi.fn();
        const latestOnUploadDone = vi.fn();
        const { result, rerender } = renderHook(({ onUploadDone }) => useFileUpload({ onUploadDone }), {
            initialProps: { onUploadDone: firstOnUploadDone },
        });

        act(() => {
            result.current[0](new File(['content'], 'file.txt'));
        });
        rerender({ onUploadDone: latestOnUploadDone });
        act(() => {
            workers[0].emit({ event: 'onDone', file_id: 'file-id' });
        });

        expect(firstOnUploadDone).not.toHaveBeenCalled();
        expect(latestOnUploadDone).toHaveBeenCalledOnce();
    });
});
