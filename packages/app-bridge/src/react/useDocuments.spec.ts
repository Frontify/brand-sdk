// @vitest-environment happy-dom

/* (c) Copyright Frontify Ltd., all rights reserved. */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

describe('useDocument', () => {
    afterEach(() => {
        vi.resetAllMocks();
    });

    it('should fetch documents on mount', async () => {});

    it('should not fetch documents on mount if not enabled', () => {});

    it('should fetch documents if it gets enabled', async () => {});

    it('should update documents if a document is added', async () => {});

    it('should update documents if a document is removed', async () => {});

    it('should update documents if a document is updated', async () => {});

    it('should return ungrouped documents and update them after changes', async () => {});

    it('should return grouped documents and update them after changes', async () => {});

    it('should update number of categorized page if an uncategorized document page is added', async () => {});

    it('should not update number of categorized page if a categorized document page is added', async () => {});

    it('should update number of categorized page if an uncategorized document page is removed', async () => {});

    it('should not update number of categorized page if a categorized document page is removed', async () => {});

    it('should update number of document category if added', async () => {});

    it('should update number of document category if remove', async () => {});
});
