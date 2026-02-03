/* (c) Copyright Frontify Ltd., all rights reserved. */

import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { EditModal } from './EditModal';

const URL_ID = 'floating-link-edit-url';

describe('EditModal', () => {
    vi.mock('@frontify/fondue/rte', async () => {
        const actual: object = await vi.importActual('@frontify/fondue/rte');
        return {
            ...actual,
            useLinkOpenButtonState: () => ({ element: { url: 'https://frontify.com' } }),
        };
    });
    it('should render the url as an anchor tag', () => {
        const { getByTestId } = render(
            <EditModal
                editButtonProps={{ onClick: vi.fn() }}
                unlinkButtonProps={{ onClick: vi.fn(), onMouseDown: vi.fn() }}
            />,
        );
        expect(getByTestId(URL_ID).tagName).toBe('A');
        expect(getByTestId(URL_ID).getAttribute('href')).toBe('https://frontify.com');
        expect(getByTestId(URL_ID).innerText).toBe('https://frontify.com');
    });
});
